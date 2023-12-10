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
        user: async (_: any, args: UserArgs): Promise<IUser | null> => {
            return await User.findById(args.id).lean();
        },
        users: async (_: any): Promise<IUser[]> => {
            const users = await User.find().lean();
            return users;
        },
    },
    Mutation: {
        createUser: async (_: any, args: CreateUserArgs): Promise<IUser> => {
            const newUser = new User(args);
            return await newUser.save();
        },
        updateUser: async (_: any, args: UpdateUserArgs): Promise<IQuestion | null> => {
            return await User.findByIdAndUpdate(args.id, args, {new: true}).lean();
        },
        deleteUser: async (_: any, args: UserArgs): Promise<string> => {
            await User.findByIdAndDelete(args.id);
            return args.id;// this should be an obj instead, but it's ok
            /*
            mutation {
  deleteUser(id: "<USER_ID>")
}

API not right

            */
        },
        deleteAllUsers: async (): Promise<IUser[]> => {
            await User.deleteMany({});
            const users = await User.find().lean();
            return users;
        },
    },
};


