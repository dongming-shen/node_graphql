// questionResolvers.ts

import {IQuestion, Question} from '../../models/questionModel';
import {IUser, User} from '../../models/userModel';
import {QuestionArgs, CreateQuestionArgs, UpdateQuestionArgs} from '../types';

export const questionResolvers = {
    Question: {
        id: (question: IQuestion) => question._id,
        title: (question: IQuestion) => question.title,
        content: (question: IQuestion) => question.content,
        author: async (question: IQuestion): Promise<IUser | null> => {
            return await User.findById(question.authorId);
        },
    },
    Query: {
        question: async (_: any, args: QuestionArgs): Promise<IQuestion | null> => {
            return await Question.findById(args.id).lean();
        },
        questions: async (_: any): Promise<IQuestion[]> => {
            const questions = await Question.find().lean();
            return questions;
        },
    },
    Mutation: {
        createQuestion: async (_: any, args: CreateQuestionArgs): Promise<IQuestion> => {
            const newQuestion = new Question(args);
            return await newQuestion.save();
        },
        updateQuestion: async (_: any, args: UpdateQuestionArgs): Promise<IQuestion | null> => {
            return await Question.findByIdAndUpdate(args.id, args, {new: true}).lean();
        },
        deleteQuestion: async (_: any, args: QuestionArgs): Promise<string> => {
            await Question.findByIdAndDelete(args.id);
            return args.id;
        },
        deleteAllQuestions: async (): Promise<IQuestion[]> => {
            await Question.deleteMany({});
            const questions = await Question.find().lean();
            return questions;
        },
    },
};


