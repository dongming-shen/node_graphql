import {buildSchema} from 'graphql';

// Base type definitions
export const typeDefs = `
type User {
  id: ID!
  name: String!
  questions(page: Int, pageSize: Int): [Question]
}

type Question {
  id: ID!
  title: String!
  content: String!
  author: User
}

input QuestionInput {
  title: String!
  content: String!
  authorId: String!
}
`;

// Query type definitions
export const queryDefs = `
type Query {
  user(id: ID!): User
  users(page: Int, pageSize: Int): [User]
  question(id: ID!): Question
  questions(page: Int, pageSize: Int): [Question]
}
`;

// Mutation type definitions
export const mutationDefs = `
type Mutation {
  createUser(name: String!): User
  updateUser(id: ID!, name: String!): User
  deleteUser(id: ID!): String
  createQuestion(input: QuestionInput): Question
  updateQuestion(id: ID!, input: QuestionInput): Question
  deleteQuestion(id: ID!): String
}
`;

const schema = buildSchema(`
  ${typeDefs}
  ${queryDefs}
  ${mutationDefs}
`);

export default schema;
