"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionModel_1 = require("../models/questionModel");
const router = express_1.default.Router();
// CREATE a new question
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newQuestion = new questionModel_1.Question(req.body);
    try {
        const savedQuestion = yield newQuestion.save();
        res.status(201).json(savedQuestion);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// READ all questions
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield questionModel_1.Question.find({});
        res.status(200).json(questions);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// READ a single question by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const question = yield questionModel_1.Question.findById(req.params.id);
        if (!question)
            res.status(404).send('Question not found');
        res.status(200).json(question);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// UPDATE a question by ID
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedQuestion = yield questionModel_1.Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedQuestion)
            res.status(404).send('Question not found with that ID');
        res.status(200).json(updatedQuestion);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// DELETE a question by ID
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedQuestion = yield questionModel_1.Question.findByIdAndDelete(req.params.id);
        if (!deletedQuestion)
            res.status(404).send('Question not found');
        res.status(200).send('Question deleted');
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.default = router;
