import {Question, IQuestion} from '../models/questionModel';
import {User, IUser} from '../models/userModel';
import {QuestionsArgs} from './types';

export interface QuestionInput {
    title: string;
    content: string;
    authorId: string;
}

///////////////////////////////////////// user

export const userResolvers = {
    Query: {
        async user (args: {id: string}): Promise<IUser | null> {
            return await User.findById(args.id).lean();
        },

        async users (args: {page?: number, pageSize?: number}): Promise<IUser[]> {
            const page = args.page || 1;
            const pageSize = args.pageSize || 10;

            const users = await User.find()
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .lean();
            console.log(users, 'users');
            return users.map(user => ({
                ...user,
                id: user._id.toString(),  // Transform MongoDB _id to GraphQL id
            }));
        },

        async userQuestions (parent: IUser): Promise<IQuestion[]> {
            return await Question.find({authorId: parent.id}).lean();
        },
    }
};

///////////////////////////////////////// question

export const questionResolvers = {
    Query: {
        // Question resolvers
        questions: async (): Promise<IQuestion[]> => {
            const questions = await Question.find().lean();
            return questions.map(q => ({
                ...q,
                id: q._id.toString(),  // Transform MongoDB _id to GraphQL id
            }));
        },
        question: async (args: {id: string}): Promise<IQuestion | null> => {
            const question = await Question.findById(args.id).lean();
            if (question) {
                return {
                    ...question,
                    id: question._id.toString(),  // Transform MongoDB _id to GraphQL id
                };
            } else {
                return null;
            }
        },
        createQuestion: async (args: {input: QuestionInput}): Promise<IQuestion> => {
            const newQuestion = new Question(args.input);
            const savedQuestion = await newQuestion.save();

            // Convert the Mongoose document to a plain object and add the id property
            const questionObject: IQuestion = savedQuestion.toObject({versionKey: false});
            questionObject.id = savedQuestion._id.toString();

            return questionObject;
        },
        updateQuestion: async (args: {id: string; input: QuestionInput}): Promise<IQuestion | null> => {
            const updatedQuestion = await Question.findByIdAndUpdate(args.id, args.input, {new: true, runValidators: true}).lean();
            if (updatedQuestion) {
                return {
                    ...updatedQuestion,
                    id: updatedQuestion._id.toString(),  // Transform MongoDB _id to GraphQL id
                };
            } else {
                return null;
            }
        },
        deleteQuestion: async (args: {id: string}): Promise<string> => {
            await Question.findByIdAndDelete(args.id);
            return "Question deleted";
        },

        questionAuthor: async (parent: IQuestion): Promise<IUser | null> => {
            return await User.findById(parent.authorId).lean();
        },
    }
};

export const resolvers = {
    User: {
        id: (user: IUser) => user._id,
        name: (user: IUser) => user.name,
        email: (user: IUser) => user.email,
        questions: async (user: IUser, args: QuestionsArgs): Promise<IQuestion[]> => {
            const page = args.page || 1;
            const pageSize = args.pageSize || 10;
            return await Question.find({authorId: user.id})
                .skip((page - 1) * pageSize)
                .limit(pageSize);
        },
    },
    Question: {
        id: (question: IQuestion) => question._id,
        title: (question: IQuestion) => question.title,
        content: (question: IQuestion) => question.content,
        author: async (question: IQuestion) => {
            return await User.findById(question.authorId);
        },
    },
    ...userResolvers,
    ...questionResolvers,
    // Here you can add other resolvers, if any...
};
