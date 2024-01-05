import { Router } from "express";
import { Question } from "../models/questionModel";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - authorId
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         authorId:
 *           type: string
 */

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       201:
 *         description: The question was successfully created
 *       500:
 *         description: Server error
 */
router.post("/", async (req, res) => {
  const newQuestion = new Question(req.body);
  try {
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(500).json({ message: "Error creating question", error });
  }
});

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Retrieve all questions
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: List of all questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().lean();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions", error });
  }
});

/**
 * @swagger
 * /questions/{id}:
 *   get:
 *     summary: Retrieve a question by its ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the question
 *     responses:
 *       200:
 *         description: Details of the question
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).lean();
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: "Error fetching question", error });
  }
});

/**
 * @swagger
 * /questions/{id}:
 *   put:
 *     summary: Update a question by its ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the question to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: The question was successfully updated
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, lean: true },
    );
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: "Error updating question", error });
  }
});

/**
 * @swagger
 * /questions/{id}:
 *   delete:
 *     summary: Delete a question by its ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the question to delete
 *     responses:
 *       200:
 *         description: The question was successfully deleted
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(
      req.params.id,
    ).lean();
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({ message: "Question deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question", error });
  }
});

export default router;
