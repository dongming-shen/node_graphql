// JobResolvers.ts

import { Bid } from "../../models/bidModel";
import { IJob, Job } from "../../models/jobModel";
import { IUser, User } from "../../models/userModel";
import { CreateJobArgs, JobArgs } from "../types";

export const JobResolvers = {
  Job: {
    id: (Job: IJob) => Job._id,
    desc: (Job: IJob) => Job.desc,
    requirements: (Job: IJob) => Job.requirements,
    author: async (Job: IJob): Promise<IUser | null> => {
      return await User.findById(Job.authorId);
    },
    bids: async (Job: IJob) => {
      const bids = await Bid.find({ jobId: Job._id });
      return bids.map((bid) => bid);
    },
  },
  Query: {
    job: async (_: never, args: JobArgs): Promise<IJob | null> => {
      return await Job.findById(args.id).lean();
    },
    top_jobs: async (): Promise<IJob[]> => {
      console.log("====top_reach=======");
      const Jobs = await Job.aggregate([
        {
          $lookup: {
            from: "bids", // Assuming the bids collection is named 'bids'
            localField: "_id",
            foreignField: "jobId",
            as: "bids",
          },
        },
        {
          $addFields: {
            numberOfBids: { $size: "$bids" },
          },
        },
        { $sort: { numberOfBids: -1 } }, // Sorting in descending order of bids
        { $limit: 10 },
      ]);
      return Jobs;
    },
  },
  recent_jobs: async (): Promise<IJob[]> => {
    console.log("====reach=======");

    const Jobs = await Job.aggregate([
      { $sort: { createdAt: -1 } }, // Sorting in descending order of bids
      { $limit: 10 },
    ]);
    return Jobs;
  },
  Mutation: {
    createJob: async (_: never, args: CreateJobArgs): Promise<IJob> => {
      // Try to find the user by name
      let user = await User.findOne({ name: args.posterName });

      // If the user doesn't exist, create a new one
      if (!user) {
        user = new User({
          name: args.posterName,
          email: args.posterContact, // Assuming email is being passed in posterContact
          password: "defaultPassword", // Set a default or generated password
        });
        await user.save();
      }

      // Create the new job with the user's ID as authorId
      const newJob = new Job({
        desc: args.desc,
        requirements: args.requirements,
        authorId: user._id,
      });

      const job = await newJob.save();
      console.log("await Job.find().lean();", await Job.find().lean());

      return job;
    },
  },
};
