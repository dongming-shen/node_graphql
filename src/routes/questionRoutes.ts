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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       500:
 *         description: Some server error
 */
router.post("/", async (req, res) => {
  const newQuestion = new Question(req.body);
  try {
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Returns the list of all the questions
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: The list of the questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 *       500:
 *         description: Some server error
 */
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find({});
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /questions/{id}:
 *   get:
 *     summary: Get a question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The question id
 *     responses:
 *       200:
 *         description: The question description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: The question was not found
 *       500:
 *         description: Some server error
 */
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).send("Question not found");
    res.status(200).json(question);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /questions/{id}:
 *   put:
 *     summary: Update a question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The question id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: The question was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: The question was not found
 *       500:
 *         description: Some server error
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedQuestion) return res.status(404).send("Question not found");
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /questions/{id}:
 *   delete:
 *     summary: Delete a question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The question id
 *     responses:
 *       200:
 *         description: The question was deleted
 *       404:
 *         description: The question was not found
 *       500:
 *         description: Some server error
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) return res.status(404).send("Question not found");
    res.status(200).send("Question deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
