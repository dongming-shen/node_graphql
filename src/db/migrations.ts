// src/db/migrations.ts
import mongoose from "mongoose";

import { User } from "../models/userModel";

import connectDB from "./index";

// An example migration function to add a new field to all user documents
const addAgeFieldToUsers = async () => {
  await User.updateMany({}, { $set: { age: null } }); // Set age to null for all users
};

// Connect to the database and run migrations
const runMigrations = async () => {
  await connectDB();

  // Run individual migration functions
  await addAgeFieldToUsers();

  console.log("Migrations completed successfully");
  mongoose.disconnect(); // Disconnect when done
};

runMigrations();
