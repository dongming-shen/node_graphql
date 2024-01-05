// utils/auth.ts
import { BlockedTokenModel } from "../models/blockedTokenModel";

import { JwtPayload, decode, sign, verify } from "jsonwebtoken";

import { User, IUser } from "../models/userModel"; // Adjust the import path to your user model

export const JWT_SECRET = "mysecretkey"; // Replace with your actual secret key

export const generateToken = (user: IUser) => {
  const payload = {
    sub: user.id, // Subject of the token, typically the user ID
    email: user.email,
    iat: Math.floor(Date.now() / 1000), // Issued at time, in Unix time
  };

  return sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  try {
    return verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const getUserFromToken = async (
  token: string,
): Promise<IUser | null> => {
  try {
    if (!token) {
      return null;
    }

    const decoded = verify(token, JWT_SECRET) as JwtPayload;
    console.log("====decoded====", decoded);
    if (!decoded.sub) {
      return null;
    }

    const user = await User.findById(decoded.sub);
    console.log("====get me user====", user);
    return user;
  } catch (error) {
    console.error("Error in getUserFromToken:", error);
    return null;
  }
};

export const addTokenToBlacklist = async (token: string) => {
  try {
    const decodedToken = decode(token);
    if (decodedToken && typeof decodedToken !== "string" && decodedToken.exp) {
      const expiresAt = new Date(decodedToken.exp * 1000);
      const blockedToken = new BlockedTokenModel({ token, expiresAt });
      await blockedToken.save();
    }
  } catch (error) {
    console.error("Failed to decode token for blacklisting:", error);
  }
};

export const isTokenBlocked = async (token: string) => {
  const blockedToken = await BlockedTokenModel.findOne({ token });
  if (!blockedToken) {
    return false;
  }

  const currentTime = new Date();
  if (blockedToken.expiresAt < currentTime) {
    // Optionally, delete the expired token from the collection
    await BlockedTokenModel.deleteOne({ _id: blockedToken._id });
    return false;
  }

  return true;
};

export const cleanupExpiredTokens = async () => {
  const currentTime = new Date();
  await BlockedTokenModel.deleteMany({ expiresAt: { $lt: currentTime } });
};
