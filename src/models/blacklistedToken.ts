// models/blacklistedToken.ts
import mongoose, { Schema, Document } from "mongoose";

// Interface for the BlacklistedToken document
interface IBlacklistedToken extends Document {
  token: string;
  expiresAt: Date;
}

// Schema definition for the BlacklistedToken
const BlacklistedTokenSchema: Schema = new Schema({
  token: { type: String, required: true, unique: true, index: true },
  expiresAt: { type: Date, required: true, index: true },
});

// Create a model from the schema
export const BlacklistedToken = mongoose.model<IBlacklistedToken>(
  "BlacklistedToken",
  BlacklistedTokenSchema,
);
