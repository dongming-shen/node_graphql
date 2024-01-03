import express from "express";
import { Question } from "../models/questionModel";

const router = express.Router();

// CREATE a new question
router.post("/", async (req, res) => {
  const newQuestion = new Question(req.body);
  try {
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(500).send(error);
  }
});

// READ all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find({});
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).send(error);
  }
});

// READ a single question by ID
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) res.status(404).send("Question not found");
    res.status(200).json(question);
  } catch (error) {
    res.status(500).send(error);
  }
});

// UPDATE a question by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedQuestion)
      res.status(404).send("Question not found with that ID");
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).send(error);
  }
});

// DELETE a question by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) res.status(404).send("Question not found");
    res.status(200).send("Question deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
