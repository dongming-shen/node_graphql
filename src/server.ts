import { readFileSync } from "fs";
import { resolve } from "path";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { gql } from "apollo-server-express";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import { config } from "dotenv";
import { serve, setup } from "swagger-ui-express";
import express, { json, Request } from "express";

import { scheduleTokenCleanup } from "./cronJobs/tokenCleanup";
import connectDB from "./db/index";
import { runSeeders } from "./db/seeders";
import { resolvers } from "./graphql/resolvers";
import questionRoutes from "./routes/questionRoutes";
import userRoutes from "./routes/userRoutes";
import { getUserFromToken } from "./utils/auth";
import { IUser } from "./models/userModel";

config();

export interface MyContext {
  user: IUser | null;
  req: Request;
}

const app = express();
const port = process.env.PORT || 3005;

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "My API Documentation",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"],
};
const swaggerSpecs = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(json());

// Serve Swagger docs
app.use("/api-docs", serve, setup(swaggerSpecs));

// Apollo Server setup
const typeDefs = gql(
  readFileSync(resolve(__dirname, "..", "schema.graphql"), {
    encoding: "utf-8",
  }),
);

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

// Start server function
async function startServer() {
  await server.start();
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }): Promise<MyContext> => {
        const token = req.headers.authorization || "";
        console.log("myToken====", token);
        const user = await getUserFromToken(token);
        return { user, req };
      },
    }),
  );

  app.use("/questions", questionRoutes);
  app.use("/users", userRoutes); // Add user routes to Express

  try {
    await runSeeders();
    await connectDB();
    scheduleTokenCleanup();
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log(
        `Swagger UI is available at http://localhost:${port}/api-docs`,
      );
    });
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
}

startServer();
