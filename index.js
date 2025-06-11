import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongo connected"))
  .catch(err => console.log(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Simulating middleware auth:
    // normally you'd verify token and attach user ID
    return { userId: req.headers.userid || null }
  }
});

await server.start();
server.applyMiddleware({ app });

app.listen(4000, () => {
  console.log("🚀 Server ready at http://localhost:4000/graphql");
});
