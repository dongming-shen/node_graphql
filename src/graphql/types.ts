// types.ts

import { IUser } from "../models/userModel";

export interface UserArgs {
  id: string;
}

export interface UsersArgs {
  page?: number;
  pageSize?: number;
}

export interface QuestionArgs {
  id: string;
}

export interface QuestionsArgs {
  page?: number;
  pageSize?: number;
}

export interface CreateUserArgs {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserArgs {
  id: string;
  name?: string;
  email?: string;
}

export interface CreateQuestionArgs {
  title: string;
  content: string;
  authorId: string;
}

export interface UpdateQuestionArgs {
  id: string;
  title?: string;
  content?: string;
  authorId?: string;
}

// src/graphql/types.ts

// AuthArgs used for login mutation arguments
export interface AuthArgs {
  email: string;
  password: string;
}

// AuthPayload that will be returned by login mutation
export interface AuthPayload {
  token: string; // JWT token
  user: IUser; // User information
}

export interface LogoutArgs {
  token: string;
}
