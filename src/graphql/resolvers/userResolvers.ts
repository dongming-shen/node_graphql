import { hash, compare } from "bcryptjs";
import { IQuestion, Question } from "../../models/questionModel";
import { IUser, User } from "../../models/userModel";

import {
  UserArgs,
  CreateUserArgs,
  UpdateUserArgs,
  AuthArgs,
  AuthPayload,
} from "../types";
import { MyContext } from "../../server";
import { addTokenToBlacklist, generateToken } from "../../utils/auth";

// Define the type for authentication payload

export const userResolvers = {
  User: {
    id: (user: IUser): string => user._id.toString(),
    name: (user: IUser): string => user.name,
    email: (user: IUser): string => user.email,
    questions: async (user: IUser): Promise<IQuestion[]> => {
      return await Question.find({ authorId: user._id });
    },
  },
  Query: {
    user: async (
      _parent: unknown,
      args: UserArgs,
      context: MyContext,
    ): Promise<IUser | null> => {
      return await User.findById(args.id).lean();
    },
    users: async (): Promise<IUser[]> => {
      return await User.find().lean();
    },
    me: async (
      _parent: unknown,
      _args: unknown,
      context: MyContext,
    ): Promise<IUser | null> => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      return context.user;
    },
  },
  Mutation: {
    createUser: async (
      _parent: unknown,
      args: CreateUserArgs,
    ): Promise<IUser> => {
      const hashedPassword = await hash(args.password, 10);
      const newUser = new User({ ...args, password: hashedPassword });
      return await newUser.save();
    },
    updateUser: async (
      _parent: unknown,
      args: UpdateUserArgs,
    ): Promise<IUser | null> => {
      return await User.findByIdAndUpdate(args.id, args, { new: true }).lean();
    },
    deleteUser: async (
      _parent: unknown,
      args: UserArgs,
    ): Promise<IUser | null> => {
      const deletedUser = await User.findByIdAndDelete(args.id).lean();
      return deletedUser;
    },
    deleteAllUsers: async (): Promise<boolean> => {
      await User.deleteMany({});
      return true;
    },

    login: async (_parent: unknown, args: AuthArgs): Promise<AuthPayload> => {
      const user = await User.findOne({ email: args.email });
      console.log("====user=====", user, args.password, user?.password);
      if (!user || !(await compare(args.password, user.password))) {
        throw new Error("Incorrect email or password");
      }

      const token = generateToken(user);

      return {
        id: user._id,
        email: user.email,
        name: user.name,
        token,
      };
    },

    // Add other mutations like signup and logout if needed
    signup: async (
      _parent: unknown,
      args: CreateUserArgs,
    ): Promise<AuthPayload> => {
      const { name, email, password } = args;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email already in use");
      }

      const hashedPassword = await hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      const token = generateToken(newUser);

      return {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        token,
      };
    },

    // 这个有bug。logout似乎没用。
    logout: async (
      _parent: unknown,
      _args: unknown,
      context: MyContext,
    ): Promise<boolean> => {
      if (!context.req.headers.authorization) {
        throw new Error("No authorization token provided");
      }

      const token = context.req.headers.authorization;
      addTokenToBlacklist(token);
      return true;
    },
  },
};

// Don't forget to export userResolvers
export default userResolvers;
