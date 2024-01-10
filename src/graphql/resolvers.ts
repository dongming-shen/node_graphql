import { BidResolvers } from "./resolvers/bidResolvers";
import { JobResolvers } from "./resolvers/jobResolvers";
import { userResolvers } from "./resolvers/userResolvers";

export const resolvers = {
  User: {
    ...userResolvers.User,
  },
  Job: {
    ...JobResolvers.Job,
  },
  Bid: {
    ...BidResolvers.Bid,
  },
  Query: {
    ...userResolvers.Query,
    ...JobResolvers.Query,
    ...BidResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...JobResolvers.Mutation,
    ...BidResolvers.Mutation,
  },
};
