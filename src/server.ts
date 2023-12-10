import express from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import gql from "graphql-tag";
import {resolvers} from './graphql/resolvers';
import {connect} from './db';
import questionRoutes from './routes/questionRoutes';
import {ApolloServer} from "@apollo/server";
import {buildSubgraphSchema} from "@apollo/subgraph";
import {expressMiddleware} from "@apollo/server/express4";
import {readFileSync} from "fs";
import {resolve, dirname} from "path";

import {fileURLToPath} from 'url';


const app = express();
const port = 3005;

app.use(cors());
app.use(bodyParser.json());

// RESTful routes
app.use('/questions', questionRoutes);

//highlight-start
const typeDefs = gql(
    readFileSync(resolve(__dirname, "..", "schema.graphql"), {
        encoding: "utf-8",
    })
);

const schema = buildSubgraphSchema({typeDefs, resolvers});
const server = new ApolloServer({
    schema,
});

// we need to wrap the server start and middleware setup in an async function.
async function startServer () {
    await server.start();

    app.use("/graphql", cors(), express.json(), expressMiddleware(server));

    connect(); // Connect to MongoDB

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

startServer();

