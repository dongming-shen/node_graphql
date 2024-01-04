// __tests__/db/seeders.test.ts
import mongoose from "mongoose";
import { User } from "../../src/models/userModel";
import { seedUsers, seedUsersFromCSV } from "../../src/db/seeders";
import fs from "fs";
import { Readable } from "stream";

jest.mock("fs");
jest.mock("../../src/models/userModel", () => ({
  User: {
    deleteMany: jest.fn(),
    insertMany: jest.fn(),
  },
}));

jest.mock("../../src/db/index", () => ({
  connectDB: jest.fn().mockResolvedValue(undefined),
}));

describe("DB Seeders", () => {
  beforeAll(() => {
    // Mock the db connection
    mongoose.connect = jest.fn().mockResolvedValue(undefined);
  });

  afterAll(() => {
    // Close db connection
    mongoose.disconnect = jest.fn().mockResolvedValue(undefined);
  });

  test("should seed users from array", async () => {
    // Assuming seedUsers is a function to seed users from an array
    await seedUsers();
    expect(User.deleteMany).toHaveBeenCalled();
    expect(User.insertMany).toHaveBeenCalledWith([
      { name: "Alice", email: "alice@example.com", password: "password123" },
      { name: "Bob", email: "bob@example.com", password: "password123" },
    ]);
  });

  test("should seed users from CSV", async () => {
    // Mock fs.createReadStream to return a readable stream that emits CSV data
    fs.createReadStream = jest.fn().mockReturnValue(
      new Readable({
        objectMode: true,
        read() {
          this.push({
            name: "Alice",
            email: "alice@example.com",
            password: "password123",
          });
          this.push({
            name: "Bob",
            email: "bob@example.com",
            password: "password123",
          });
          this.push(null); // signify the end of the stream
        },
      }),
    );

    // Mock User.insertMany to resolve when called
    User.insertMany.mockResolvedValue([]);

    // Call the seedUsersFromCSV function with a mock file path
    const filePath = "path/to/mock/users.csv";
    await seedUsersFromCSV(filePath);

    // Check that User.insertMany was called with the mock user data
    expect(User.insertMany).toHaveBeenCalledWith([
      { name: "Alice", email: "alice@example.com", password: "password123" },
      { name: "Bob", email: "bob@example.com", password: "password123" },
    ]);

    // Check that fs.createReadStream was called with the correct file path
    expect(fs.createReadStream).toHaveBeenCalledWith(filePath);
  });
});

// The implementation of the seedUsers function
async function seedUsers() {
  await User.deleteMany();
  await User.insertMany([
    { name: "Alice", email: "alice@example.com", password: "password123" },
    { name: "Bob", email: "bob@example.com", password: "password123" },
  ]);
}

// You need to update the seedUsersFromCSV function to actually return a promise
// or use async/await so that it can be awaited in the test
