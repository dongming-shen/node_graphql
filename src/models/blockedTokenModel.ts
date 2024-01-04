// models/blockedToken.ts
import mongoose, { Schema, Document } from "mongoose";

// Interface for the BlockedToken document
interface IBlockedToken extends Document {
  token: string;
  expiresAt: Date;
}

// Schema definition for the BlockedToken
const BlockedTokenSchema: Schema = new Schema({
  token: { type: String, required: true, unique: true, index: true },
  expiresAt: { type: Date, required: true, index: true },
});

// Create a model from the schema
export const BlockedTokenModel = mongoose.model<IBlockedToken>(
  "BlockedToken",
  BlockedTokenSchema,
);
