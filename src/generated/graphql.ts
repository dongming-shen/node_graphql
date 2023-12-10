import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Mutation = {
  __typename?: 'Mutation';
  createQuestion?: Maybe<Question>;
  createUser?: Maybe<User>;
  deleteQuestion?: Maybe<Scalars['String']['output']>;
  deleteUser?: Maybe<Scalars['String']['output']>;
  updateQuestion?: Maybe<Question>;
  updateUser?: Maybe<User>;
};


export type MutationCreateQuestionArgs = {
  input?: InputMaybe<QuestionInput>;
};


export type MutationCreateUserArgs = {
  name: Scalars['String']['input'];
};


export type MutationDeleteQuestionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateQuestionArgs = {
  id: Scalars['ID']['input'];
  input?: InputMaybe<QuestionInput>;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  question?: Maybe<Question>;
  questions?: Maybe<Array<Maybe<Question>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryQuestionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryQuestionsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};

export type Question = {
  __typename?: 'Question';
  author?: Maybe<User>;
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type QuestionInput = {
  authorId: Scalars['String']['input'];
  content: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  questions?: Maybe<Array<Maybe<Question>>>;
};


export type UserQuestionsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};

export type GetQuestionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetQuestionsQuery = { __typename?: 'Query', questions?: Array<{ __typename?: 'Question', id: string, title: string, content: string, author?: { __typename?: 'User', id: string, name: string } | null } | null> | null };

export type CreateQuestionMutationVariables = Exact<{
  input?: InputMaybe<QuestionInput>;
}>;


export type CreateQuestionMutation = { __typename?: 'Mutation', createQuestion?: { __typename?: 'Question', id: string, title: string, content: string, author?: { __typename?: 'User', id: string, name: string } | null } | null };


export const GetQuestionsDocument = gql`
    query GetQuestions {
  questions {
    id
    title
    content
    author {
      id
      name
    }
  }
}
    `;
export const CreateQuestionDocument = gql`
    mutation CreateQuestion($input: QuestionInput) {
  createQuestion(input: $input) {
    id
    title
    content
    author {
      id
      name
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetQuestions(variables?: GetQuestionsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetQuestionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetQuestionsQuery>(GetQuestionsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetQuestions', 'query');
    },
    CreateQuestion(variables?: CreateQuestionMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateQuestionMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateQuestionMutation>(CreateQuestionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateQuestion', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;