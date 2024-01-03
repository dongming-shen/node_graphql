// userRoutes.ts
import express from "express";
import { User } from "../models/userModel"; // Adjust the import path as neede
import { Question } from "../models/questionModel";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/auth";
import { addTokenToBlacklist } from "../utils/tokenBlacklist";

// Have not test rest!!
const router = express.Router();

// CREATE a new user
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error instanceof Error) {
      // Now TypeScript knows that error is of type Error
      res.status(400).json({ message: error.message });
    } else {
      // Handle the case where the error is not an Error object
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

// READ all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      // Now TypeScript knows that error is of type Error
      res.status(400).json({ message: error.message });
    } else {
      // Handle the case where the error is not an Error object
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

// READ a single user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      // Now TypeScript knows that error is of type Error
      res.status(400).json({ message: error.message });
    } else {
      // Handle the case where the error is not an Error object
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

// UPDATE a user by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      // Now TypeScript knows that error is of type Error
      res.status(400).json({ message: error.message });
    } else {
      // Handle the case where the error is not an Error object
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

// DELETE a user by ID
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User Deleted" });
  } catch (error) {
    if (error instanceof Error) {
      // Now TypeScript knows that error is of type Error
      res.status(400).json({ message: error.message });
    } else {
      // Handle the case where the error is not an Error object
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

// ... other imports and route definitions ...

// GET all questions for a specific user
router.get("/:userId/questions", async (req, res) => {
  try {
    const userId = req.params.userId;
    const questions = await Question.find({ authorId: userId }).lean();
    res.json(questions);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

// ... other route definitions ... Login

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGOUT a user
router.post("/logout", (req, res) => {
  const { token } = req.body;
  addTokenToBlacklist(token);
  res.json({ message: "Logout successful" });
});

export default router;
