import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {graphqlHTTP} from 'express-graphql';
import schema from './graphql/schema';
import resolvers from './graphql/resolvers';
import {connect} from './db';
import questionRoutes from './routes/questionRoutes';

const app = express();
const port = 3005;

app.use(cors());
app.use(bodyParser.json());

// RESTful routes
app.use('/questions', questionRoutes);

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true, // Make sure this is set to true to use the GraphiQL interface
}));

connect(); // Connect to MongoDB

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
