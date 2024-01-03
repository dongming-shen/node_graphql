// utils/auth.ts
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/userModel"; // Adjust the import path to your user model

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Replace with your actual secret key

export const generateToken = (user: { id: string; email: string }) => {
  const payload = {
    sub: user.id, // Subject of the token, typically the user ID
    email: user.email,
    iat: Math.floor(Date.now() / 1000), // Issued at time, in Unix time
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
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

    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    if (!decoded.sub) {
      return null;
    }

    const user = await User.findById(decoded.sub);
    return user;
  } catch (error) {
    console.error("Error in getUserFromToken:", error);
    return null;
  }
};
