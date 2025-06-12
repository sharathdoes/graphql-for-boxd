import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import typeDefs from './graphql/typedefs.js';
import resolvers from './graphql/resolvers.js';
import { startStandaloneServer } from '@apollo/server/standalone';


const server = new ApolloServer({ typeDefs, resolvers });

mongoose.connect('mongodb://localhost:27017/nodejstest');

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
  
console.log(`🚀  Server ready at: ${url}`);
