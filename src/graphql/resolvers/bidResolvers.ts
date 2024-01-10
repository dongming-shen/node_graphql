// BidResolvers.ts

import { Bid, IBid } from "../../models/bidModel";
import { IJob, Job } from "../../models/jobModel";
import { IUser, User } from "../../models/userModel";
import { CreateBidArgs } from "../types";

export const BidResolvers = {
  Bid: {
    id: (Bid: IBid) => Bid._id,
    author: async (Bid: IBid): Promise<IUser | null> => {
      return await User.findById(Bid.authorId);
    },
    job: async (Bid: IBid): Promise<IJob | null> => {
      // Assuming Bid has a jobId field linking to the Job it belongs to
      return await Job.findById(Bid.jobId);
    },
  },
  Query: {},
  Mutation: {
    createBid: async (_: never, args: CreateBidArgs): Promise<IBid> => {
      // Fetch the corresponding job
      const job = await Job.findById(args.jobId);
      if (!job) {
        throw new Error("Job not found");
      }

      // Check if current time exceeds job's creation time by 3600 seconds
      const currentTime = new Date().getTime();
      const jobCreationTime = new Date("Job.getCreationTime").getTime(); // job.createdAt TODO
      if (currentTime > jobCreationTime) {
        // 3600 seconds in milliseconds
        throw new Error("Bid cannot be created after 1 hour of job posting");
      }

      // Check if the user exists
      let user = await User.findOne({ name: args.authorName });
      if (!user) {
        user = new User({
          name: args.authorName,
          email: args.authorContact,
          password: "defaultPassword", // Use a more secure approach for real applications
        });
        await user.save();
      }

      // Create the new bid with the job ID and user's ID
      const newBid = new Bid({
        jobId: args.jobId,
        authorId: user._id,
        // Add other bid-related fields here
      });

      return await newBid.save();
    },
  },
};
