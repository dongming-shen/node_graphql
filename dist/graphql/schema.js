"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutationDefs = exports.queryDefs = exports.typeDefs = void 0;
const graphql_1 = require("graphql");
// Base type definitions
exports.typeDefs = `
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
exports.queryDefs = `
type Query {
  user(id: ID!): User
  users(page: Int, pageSize: Int): [User]
  question(id: ID!): Question
  questions(page: Int, pageSize: Int): [Question]
}
`;
// Mutation type definitions
exports.mutationDefs = `
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
const schema = (0, graphql_1.buildSchema)(`
  ${exports.typeDefs}
  ${exports.queryDefs}
  ${exports.mutationDefs}
`);
exports.default = schema;
