// Before we can create any resolvers, we need to first create the type definition.
// import the gql tagged template function
const { gql } = require('apollo-server-express');

// All of our type definitions will go into the typeDefs tagged template function.
// To define a query, you use the type 'Query' {} data type, which is built into GraphQL
const typeDefs = gql`

    type Thought {
        _id: ID
        thoughtText: String
        createdAt: String
        username: String
        reactionCount: Int
        reactions: [Reaction]
    }

    type Reaction {
        _id: ID
        reactionBody: String
        createdAt: String
        username: String
    }

    type Query {
        thoughts(username: String): [Thought]
    }
`;

// export the typeDefs
module.exports = typeDefs;

