import {buildSchema} from 'graphql';

// Base type definitions
export const typeDefs = `
type User {
  id: ID!
  name: String!
  email: String!
  questions(page: Int, pageSize: Int): [Question]
}

type Question {
  id: ID!
  title: String!
  content: String!
  author: User
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
  createUser(name: String!, email: String!): User
  updateUser(id: ID!, name: String, email: String): User
  deleteUser(id: ID!): String
  deleteAllUsers: [User]
  createQuestion(title: String!, content: String!, authorId: String!): Question
  updateQuestion(id: ID!, title: String, content: String, authorId: String): Question
  deleteQuestion(id: ID!): String
  deleteAllQuestions: [Question]
}
`;

const schema = buildSchema(`
  ${typeDefs}
  ${queryDefs}
  ${mutationDefs}
`);

export default schema;
