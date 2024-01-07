import { seedUsersFromCSV } from "../../src/db/seeders";
import fs from "fs";
import { Readable } from "stream";
import mongoose from "mongoose";
import { hash } from "bcryptjs";

jest.mock("mongoose");

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password123"),
}));

jest.mock("fs");
jest.mock("../../src/models/userModel", () => ({
  User: {
    deleteMany: jest.fn().mockResolvedValue(null),
    insertMany: jest.fn().mockImplementation((users) => Promise.resolve(users)),
  },
}));

describe("DB Seeders", () => {
  beforeAll(() => {
    mongoose.connect = jest.fn().mockResolvedValue(undefined);
  });

  afterAll(() => {
    mongoose.disconnect = jest.fn().mockResolvedValue(undefined);
  });

  test("should", async () => {
    fs.createReadStream = jest.fn().mockReturnValue(
      new Readable({
        objectMode: true,
        read() {
          this.push("name,email,password\n"); // Adding headers (if your CSV parser expects them)
          this.push("Alice,alice@example.com,password123\n");
          this.push("Bob,bob@example.com,password123\n");
          this.push(null); // Signal the end of the stream
        },
      }),
    );

    const filePath = "./users.csv";
    await seedUsersFromCSV(filePath);

    expect(hash).toHaveBeenCalledWith("password123", 10);

    expect(fs.createReadStream).toHaveBeenCalledWith(filePath);
  }, 1000000);
});
