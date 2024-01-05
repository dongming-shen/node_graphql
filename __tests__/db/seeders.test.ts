import mongoose from "mongoose";
import { User } from "../../src/models/userModel";
import { seedUsersFromCSV } from "../../src/db/seeders";
import fs from "fs";
import { Readable } from "stream";

jest.mock("fs");
jest.mock("../../src/models/userModel", () => ({
  User: {
    deleteMany: jest.fn().mockResolvedValue(null),
    insertMany: jest.fn().mockImplementation((users) => Promise.resolve(users)),
  },
}));

jest.mock("../../src/db/index", () => ({
  connectDB: jest.fn().mockResolvedValue(undefined),
}));

describe("DB Seeders", () => {
  beforeAll(() => {
    mongoose.connect = jest.fn().mockResolvedValue(undefined);
  });

  afterAll(() => {
    mongoose.disconnect = jest.fn().mockResolvedValue(undefined);
  });

  test("should seed users from CSV", async () => {
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
          this.push(null);
        },
      }),
    );

    const filePath = "./users.csv";
    await seedUsersFromCSV(filePath);

    expect(User.insertMany).toHaveBeenCalledWith([
      { name: "Alice", email: "alice@example.com", password: "password123" },
      { name: "Bob", email: "bob@example.com", password: "password123" },
    ]);

    expect(fs.createReadStream).toHaveBeenCalledWith(filePath);
  });
});
