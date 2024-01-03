import { questionResolvers } from "./resolvers/questionResolvers";
import { userResolvers } from "./resolvers/userResolvers";

export const resolvers = {
  User: {
    ...userResolvers.User,
  },
  Question: {
    ...questionResolvers.Question,
  },
  Query: {
    ...userResolvers.Query,
    ...questionResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...questionResolvers.Mutation,
  },
};
