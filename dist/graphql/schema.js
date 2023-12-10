"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutationDefs = exports.queryDefs = exports.typeDefs = void 0;
const graphql_1 = require("graphql");
// Base type definitions
exports.typeDefs = `
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
  createUser(name: String!): User
  updateUser(id: ID!, name: String!): User
  deleteUser(id: ID!): String
  createQuestion(input: QuestionInput): Question
  updateQuestion(id: ID!, input: QuestionInput): Question
  deleteQuestion(id: ID!): String
}
`;
const schema = (0, graphql_1.buildSchema)(`
  ${exports.typeDefs}
  ${exports.queryDefs}
  ${exports.mutationDefs}
`);
exports.default = schema;
