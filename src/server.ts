import express from "express";
import cors from "cors";
import gql from "graphql-tag";
import { resolvers } from "./graphql/resolvers";
import connectDB from "./db/index"; // Ensure this path is correct
import questionRoutes from "./routes/questionRoutes";
import { expressMiddleware } from "@apollo/server/express4";
import { readFileSync } from "fs";
import { resolve } from "path";
import { scheduleTokenCleanup } from "./cronJobs/tokenCleanup"; // Import the scheduleTokenCleanup function
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";

dotenv.config();

const app = express();
const port = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());
app.use("/questions", questionRoutes);

const typeDefs = gql(
  readFileSync(resolve(__dirname, "..", "schema.graphql"), {
    encoding: "utf-8",
  }),
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await server.start();

  app.use("/graphql", cors(), express.json(), expressMiddleware(server));

  try {
    await connectDB();
    scheduleTokenCleanup();
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
}

startServer();
