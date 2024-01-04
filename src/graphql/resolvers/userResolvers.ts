import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { IQuestion, Question } from "../../models/questionModel";
import { IUser, User } from "../../models/userModel";
import { addTokenToBlacklist } from "../../utils/tokenBlacklist";
import {
  UserArgs,
  CreateUserArgs,
  UpdateUserArgs,
  AuthArgs,
  LogoutArgs,
} from "../types";

// Define the type for authentication payload
interface AuthPayload {
  token: string;
  user: IUser;
}

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

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
    user: async (_parent: unknown, args: UserArgs): Promise<IUser | null> => {
      return await User.findById(args.id).lean();
    },
    users: async (): Promise<IUser[]> => {
      return await User.find().lean();
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
      if (!user || !(await compare(args.password, user.password))) {
        throw new Error("Incorrect email or password");
      }
      const token = sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
      return { token, user };
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

      const token = sign({ id: newUser._id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      return { token, user: newUser };
    },

    logout: async (_parent: unknown, args: LogoutArgs): Promise<boolean> => {
      // Assuming logoutArgs contains the token
      const { token } = args;
      addTokenToBlacklist(token); // Implement this function as per your blacklist logic
      return true;
    },
  },
};

// Don't forget to export userResolvers
export default userResolvers;
