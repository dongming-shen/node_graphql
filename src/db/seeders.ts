// src/db/seeders.ts
import { User } from "../models/userModel";
import mongoose from "mongoose";
import connectDB from "./index";
import fs from "fs";
import csv from "csv-parser";

// Example user data
const users = [
  { name: "Alice", email: "alice@example.com", password: "password123" },
  { name: "Bob", email: "bob@example.com", password: "password123" },
  // Add more user objects
];

const seedUsers = async () => {
  try {
    await User.deleteMany(); // Clear the existing users
    await User.insertMany(users); // Insert new users
    console.log("Users seeded successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};
////

const seedUsersFromCSV = async (filePath: string) => {
  const users = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => users.push(row))
    .on("end", async () => {
      try {
        await connectDB();
        await User.deleteMany(); // Clear the existing users
        await User.insertMany(users); // Insert new users
        console.log("Users seeded successfully");
        mongoose.disconnect();
      } catch (error) {
        console.error("Error seeding users:", error);
        mongoose.disconnect();
        process.exit(1);
      }
    });
};

const filePath = "./path/to/your/users.csv"; // Update this to the path of your CSV file
seedUsersFromCSV(filePath);
/////

// Connect to the database and run seeders
const runSeeders = async () => {
  await connectDB();
  await seedUsers();
  mongoose.disconnect(); // Disconnect when done
};

runSeeders();
