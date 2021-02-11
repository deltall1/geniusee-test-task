require('dotenv').config();
import {ApolloServer} from 'apollo-server-lambda';
import resolvers from './graphql/resolvers/index';
import {typeDefs} from './graphql/schema';
import mongoose from "mongoose";
import {authMiddleware} from "./middleware/auth";

const apolloServer = new ApolloServer({
    resolvers,
    typeDefs: typeDefs,
    context: ({event}) => (
        authMiddleware(event)
    )
});

const createHandler = async () => {
    await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}`);
    return apolloServer.createHandler();
}

exports.graphqlHandler = (event, context, callback) => {
    createHandler().then(handler => handler(event, context, callback))
}