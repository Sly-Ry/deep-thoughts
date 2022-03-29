const express = require('express');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
  // create new ApolloServer and pass in our schema data
  //  With the new ApolloServer() function, we provide the type definitions and resolvers so they know what our API looks like and how it resolves requests.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // This ensures that every request performs an authentication check, and the updated request object will be passed to the resolvers as the context.
    context: authMiddleware
  });

  // Start the Apollo server
  await server.start();
  
  // integrate our Apollo server with the Express application as middleware.
  // We then connect our Apollo server to our Express.js server. This will create a special /graphql endpoint for the Express.js server that will serve as the main endpoint for accessing the entire API.
  server.applyMiddleware({ app });

  // log where we can go to test our GQL API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

// Initialize the Apolloe server
startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
