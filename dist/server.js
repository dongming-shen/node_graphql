"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_graphql_1 = require("express-graphql");
const schema_1 = __importDefault(require("./graphql/schema"));
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
const db_1 = require("./db");
const questionRoutes_1 = __importDefault(require("./routes/questionRoutes"));
const app = (0, express_1.default)();
const port = 3005;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// RESTful routes
app.use('/questions', questionRoutes_1.default);
// GraphQL endpoint
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
    schema: schema_1.default,
    rootValue: resolvers_1.default,
    graphiql: true, // Make sure this is set to true to use the GraphiQL interface
}));
(0, db_1.connect)(); // Connect to MongoDB
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
