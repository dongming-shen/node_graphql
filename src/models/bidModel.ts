import mongoose, { Schema, Document } from "mongoose";

export interface IBid extends Document {
  name: string;
  authorId: mongoose.Schema.Types.ObjectId; // Reference to User model
  amount: number;
  jobId: mongoose.Schema.Types.ObjectId; // Reference to Job model
}

const BidSchema: Schema = new Schema(
  {
    name: { type: String, required: false },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    amount: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Bid = mongoose.model<IBid>("Bid", BidSchema);
