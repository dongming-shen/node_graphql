import jwt from "jsonwebtoken";
import { BlacklistedToken } from "../models/blacklistedToken";

export const addTokenToBlacklist = async (token: string) => {
  try {
    const decodedToken = jwt.decode(token);
    if (decodedToken && typeof decodedToken !== "string" && decodedToken.exp) {
      const expiresAt = new Date(decodedToken.exp * 1000);
      const blacklistedToken = new BlacklistedToken({ token, expiresAt });
      await blacklistedToken.save();
    }
  } catch (error) {
    console.error("Failed to decode token for blacklisting:", error);
  }
};

export const isTokenBlacklisted = async (token: string) => {
  const blacklistedToken = await BlacklistedToken.findOne({ token });
  if (!blacklistedToken) {
    return false;
  }

  const currentTime = new Date();
  if (blacklistedToken.expiresAt < currentTime) {
    // Optionally, delete the expired token from the collection
    await BlacklistedToken.deleteOne({ _id: blacklistedToken._id });
    return false;
  }

  return true;
};

export const cleanupExpiredTokens = async () => {
  const currentTime = new Date();
  await BlacklistedToken.deleteMany({ expiresAt: { $lt: currentTime } });
};
