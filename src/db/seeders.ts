// src/db/seeders.ts
import fs from "fs";

import { hash } from "bcryptjs";
import csv from "csv-parser";
import connectDB from ".";
import { IUser, User } from "../models/userModel";

export const seedUsersFromCSV = async (filePath: string) => {
  const users: IUser[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", async (row) => {
        try {
          // Hash the password before pushing the user to the array
          const hashedPassword = await hash(row.password, 10);
          users.push({ ...row, password: hashedPassword });
        } catch (error) {
          reject(error);
        }
      })
      .on("end", async () => {
        try {
          await connectDB();
          await User.deleteMany(); // Clear the existing users
          await User.insertMany(users); // Insert new users with hashed passwords
          console.log("Users seeded successfully");
          resolve();
        } catch (error) {
          console.error("Error seeding users:", error);
          reject(error);
        }
      });
  });
};

const filePath = "./users.csv"; // Update this to the path of your CSV file

/////

// Connect to the database and run seeders
export const runSeeders = async () => {
  await connectDB();
  // await seedUsers();
  await seedUsersFromCSV(filePath);
};
