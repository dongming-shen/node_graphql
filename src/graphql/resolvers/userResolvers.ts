// userResolvers.ts

import {IQuestion, Question} from '../../models/questionModel';
import {IUser, User} from '../../models/userModel';
import {UserArgs, CreateUserArgs, UpdateUserArgs} from '../types';

export const userResolvers = {
    User: {
        id: (user: IUser) => user._id,
        name: (user: IUser) => user.name,
        email: (user: IUser) => user.email,
        questions: async (user: IUser): Promise<IQuestion[]> => {
            return await Question.find({authorId: user._id});
        },
    },
    Query: {
        user: async (args: UserArgs): Promise<IUser | null> => {
            return await User.findById(args.id).lean();
        },
        users: async (): Promise<IUser[]> => {
            const users = await User.find().lean();
            return users;
        },
    },
    Mutation: {
        createUser: async (args: CreateUserArgs): Promise<IUser> => {
            const newUser = new User(args);
            return await newUser.save();
        },
        updateUser: async (args: UpdateUserArgs): Promise<IQuestion | null> => {
            return await User.findByIdAndUpdate(args.id, args, {new: true}).lean();
        },
        deleteUser: async (args: UserArgs): Promise<string> => {
            await User.findByIdAndDelete(args.id);
            return args.id;
        },
        deleteAllUsers: async (): Promise<IUser[]> => {
            await User.deleteMany({});
            const users = await User.find().lean();
            return users;
        },
    },
};


