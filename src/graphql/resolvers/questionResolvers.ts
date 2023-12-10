// questionResolvers.ts

import {IQuestion, Question} from '../../models/questionModel';
import {User} from '../../models/userModel';
import {QuestionArgs, QuestionsArgs, CreateQuestionArgs, UpdateQuestionArgs} from '../types';

export const questionResolvers = {
    Query: {
        question: async (_: any, args: QuestionArgs) => {
            return await Question.findById(args.id).lean();
        },
        questions: async (_: any, args: QuestionsArgs): Promise<IQuestion[]> => {

            const page = args.page || 1;
            const pageSize = args.pageSize || 10;
            console.log('===ran');
            console.log('===ran2');
            return await Question.find()
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .lean();
        },
    },
    Mutation: {
        createQuestion: async (_: any, args: CreateQuestionArgs) => {
            const newQuestion = new Question(args);
            return await newQuestion.save();
        },
        updateQuestion: async (_: any, args: UpdateQuestionArgs) => {
            return await Question.findByIdAndUpdate(args.id, args, {new: true}).lean();
        },
        deleteQuestion: async (_: any, args: QuestionArgs) => {
            await Question.findByIdAndDelete(args.id);
            return `Question with ID ${args.id} deleted`;
        },
        deleteAllQuestions: async () => {
            await Question.deleteMany({});
            return `All questions deleted`;
        },
    },
    Question: {
        author: async (question: IQuestion) => {
            return await User.findById(question.authorId);
        },
    },
};


