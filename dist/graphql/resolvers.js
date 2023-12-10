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
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionResolvers = exports.userResolvers = void 0;
const questionModel_1 = require("../models/questionModel");
const userModel_1 = require("../models/userModel");
///////////////////////////////////////// user
exports.userResolvers = {
    user: (args) => __awaiter(void 0, void 0, void 0, function* () {
        return yield userModel_1.User.findById(args.id).lean();
    }),
    users: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const page = args.page || 1;
        const pageSize = args.pageSize || 10;
        const users = yield userModel_1.User.find()
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean();
        return users;
    }),
    userQuestions: (parent) => __awaiter(void 0, void 0, void 0, function* () {
        return yield questionModel_1.Question.find({ authorId: parent.id }).lean();
    }),
};
///////////////////////////////////////// question
exports.questionResolvers = {
    // Question resolvers
    questions: () => __awaiter(void 0, void 0, void 0, function* () {
        const questions = yield questionModel_1.Question.find().lean();
        return questions.map(q => (Object.assign(Object.assign({}, q), { id: q._id.toString() })));
    }),
    question: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const question = yield questionModel_1.Question.findById(args.id).lean();
        if (question) {
            return Object.assign(Object.assign({}, question), { id: question._id.toString() });
        }
        else {
            return null;
        }
    }),
    createQuestion: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const newQuestion = new questionModel_1.Question(args.input);
        const savedQuestion = yield newQuestion.save();
        // Convert the Mongoose document to a plain object and add the id property
        const questionObject = savedQuestion.toObject({ versionKey: false });
        questionObject.id = savedQuestion._id.toString();
        return questionObject;
    }),
    updateQuestion: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedQuestion = yield questionModel_1.Question.findByIdAndUpdate(args.id, args.input, { new: true, runValidators: true }).lean();
        if (updatedQuestion) {
            return Object.assign(Object.assign({}, updatedQuestion), { id: updatedQuestion._id.toString() });
        }
        else {
            return null;
        }
    }),
    deleteQuestion: (args) => __awaiter(void 0, void 0, void 0, function* () {
        yield questionModel_1.Question.findByIdAndDelete(args.id);
        return "Question deleted";
    }),
    questionAuthor: (parent) => __awaiter(void 0, void 0, void 0, function* () {
        return yield userModel_1.User.findById(parent.authorId).lean();
    }),
};
const resolvers = Object.assign(Object.assign({}, exports.userResolvers), exports.questionResolvers);
exports.default = resolvers;
