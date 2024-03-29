// types.ts

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
  id: string;
  email: string;
  name: string;
  token: string; // JWT token
}

export interface LogoutArgs {
  token: string;
}

export interface JobArgs {
  id: string;
}

export interface CreateJobArgs {
  desc: string;
  requirements: string;
  posterName: string;
  posterContact: string;
}

export interface CreateBidArgs {
  jobId: string;
  authorName: string;
  authorContact: string; // Assuming this is an email
  amount: number;
  // Add other bid-related fields as necessary
}
