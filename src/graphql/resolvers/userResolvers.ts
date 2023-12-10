// userResolvers.ts

import {Question} from '../../models/questionModel';
import {IUser, User} from '../../models/userModel';
import {UserArgs, UsersArgs, CreateUserArgs, UpdateUserArgs, QuestionsArgs} from '../types';

export const userResolvers = {
    Query: {
        user: async (_: any, args: UserArgs) => {
            return await User.findById(args.id).lean();
        },
        users: async (_: any, args: UsersArgs) => {
            const page = args.page || 1;
            const pageSize = args.pageSize || 10;
            return await User.find()
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .lean();
        },
    },
    Mutation: {
        createUser: async (_: any, args: CreateUserArgs) => {
            const newUser = new User(args);
            return await newUser.save();
        },
        updateUser: async (_: any, args: UpdateUserArgs) => {
            return await User.findByIdAndUpdate(args.id, args, {new: true}).lean();
        },
        deleteUser: async (_: any, args: UserArgs) => {
            await User.findByIdAndDelete(args.id);
            return `User with ID ${args.id} deleted`;
        },
        deleteAllUsers: async () => {
            await User.deleteMany({});
            return `All users deleted`;
        },
    },
    User: {
        questions: async (user: IUser, args: QuestionsArgs) => {
            const page = args.page || 1;
            const pageSize = args.pageSize || 10;
            return await Question.find({authorId: user.id})
                .skip((page - 1) * pageSize)
                .limit(pageSize);
        },
    },
};


