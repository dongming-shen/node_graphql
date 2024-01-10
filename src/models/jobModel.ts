import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  desc: string;
  requirements: string;
  authorId: mongoose.Schema.Types.ObjectId; // Reference to User model
  winnner: mongoose.Schema.Types.ObjectId;
}

const JobSchema: Schema = new Schema(
  {
    desc: { type: String, required: true },
    requirements: { type: String, required: true },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true },
  // createAt
);

export const Job = mongoose.model<IJob>("Job", JobSchema);
