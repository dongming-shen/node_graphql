// src/cronJobs/tokenCleanup.ts
import cron from "node-cron";
import { cleanupExpiredTokens } from "../utils/tokenBlacklist";

export const scheduleTokenCleanup = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running scheduled cleanup of expired tokens...");
    await cleanupExpiredTokens();
    console.log("Cleanup of expired tokens completed.");
  });
};
