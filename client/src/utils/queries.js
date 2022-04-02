import { gql } from '@apollo/client';

export const QUERY_THOUGHTS = gql`
  query thoughts($username: String) {
    thoughts(username: $username) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  }
`;

export const QUERY_THOUGHT = gql`
  query thought($id: ID!) {
    thought(_id: $id) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  }
`;

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      friendCount
      friends {
        _id
        username
      }
      thoughts {
        _id
        thoughtText
        createdAt
        reactionCount
      }
    }
  }
`;

// This query doesn't have the same syntax as the other queries because we aren't passing any variables to it. We simply name the query, and GraphQL will handle the rest.
// With this query, we're going to retrieve essentially all data related to the logged-in user. We'll retrieve their user information, thoughts, reactions to those thoughts, and friend list. This one will be great for the user's personal profile page, but we don't really need this much for the homepage, so let's create one more using the me query that returns less data.
export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      friendCount
      thoughts {
        _id
        thoughtText
        createdAt
        reactionCount
        reactions {
          _id
          createdAt
          reactionBody
          username
        }
      }
      friends {
        _id
        username
      }
    }
  }
`;

// With this query, we're requesting significantly less data to be returned over HTTP. If we were to do this with a RESTful API, we'd have to create another route to query a user and return less information. With GraphQL, we can reuse the same query we created and simply ask for less.
// With GraphQL, there's even a way to use the same exact front-end query to request less information, but it's advanced technique. Once you feel more comfortable with GraphQL and Apollo, look up how to use something called "Directives"!
export const QUERY_ME_BASIC = gql`
  {
    me {
      _id
      username
      email
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;