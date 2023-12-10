import {questionResolvers} from './resolvers/questionResolvers';
import {userResolvers} from './resolvers/userResolvers';

export interface QuestionInput {
    title: string;
    content: string;
    authorId: string;
}

///////////////////////////////////////// user

// export const userResolvers = {
//     Query: {
//         users: async (): Promise<IUser[]> => {
//             console.log('====users');
//             const users = await User.find().lean();
//             return users;
//         },

//         async user (args: {id: string}): Promise<IUser | null> {
//             return await User.findById(args.id).lean();
//         },
//     }
// };

///////////////////////////////////////// question

// export const questionResolvers = {
//     Query: {
//         // Question resolvers
//         questions: async (): Promise<IQuestion[]> => {
//             const questions = await Question.find().lean();
//             console.log('wuuut======', questions);
//             return questions;
//         },
//         question: async (args: {id: string}): Promise<IQuestion | null> => {
//             const question = await Question.findById(args.id).lean();
//             if (question) {
//                 return {
//                     ...question,
//                     id: question._id.toString(),  // Transform MongoDB _id to GraphQL id
//                 };
//             } else {
//                 return null;
//             }
//         },
//         createQuestion: async (args: {input: QuestionInput}): Promise<IQuestion> => {
//             const newQuestion = new Question(args.input);
//             const savedQuestion = await newQuestion.save();

//             // Convert the Mongoose document to a plain object and add the id property
//             const questionObject: IQuestion = savedQuestion.toObject({versionKey: false});
//             questionObject.id = savedQuestion._id.toString();

//             return questionObject;
//         },
//         updateQuestion: async (args: {id: string; input: QuestionInput}): Promise<IQuestion | null> => {
//             const updatedQuestion = await Question.findByIdAndUpdate(args.id, args.input, {new: true, runValidators: true}).lean();
//             if (updatedQuestion) {
//                 return {
//                     ...updatedQuestion,
//                     id: updatedQuestion._id.toString(),  // Transform MongoDB _id to GraphQL id
//                 };
//             } else {
//                 return null;
//             }
//         },
//         deleteQuestion: async (args: {id: string}): Promise<string> => {
//             await Question.findByIdAndDelete(args.id);
//             return "Question deleted";
//         },
//     }
// };

export const resolvers = {
    User: {
        ...userResolvers.User,
    },
    Question: {
        ...questionResolvers.Question,
    },
    Query: {
        ...userResolvers.Query,
        ...questionResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...questionResolvers.Mutation,
    }
    // Here you can add other resolvers, if any...
};
