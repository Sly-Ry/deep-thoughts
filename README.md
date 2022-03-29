GraphQL (Links to an external site.) is a query language for APIs and a runtime for fulfilling queries with your existing data, giving clients the power to ask for exactly what they need and nothing more. For this module’s application, you’ll use the graphql (Links to an external site.) package to parse GraphQL syntax in both your front-end and back-end codebase.
    
    - You must use double-quotes for strings in GraphQL. You'll get a syntax error if you use single-quotes.
    
    - With REST APIs, we implement CRUD actions through the HTTP verbs GET, POST, PUT, and DELETE. With GraphQL, however, we split these four actions into the following two categories:

        Queries: Queries are how we perform GET requests and ask for data from a GraphQL API.

        Mutations: Mutations are how we perform POST, PUT, and DELETE requests to create or manipulate data through a GraphQL API.
    
    - When we access our GraphQL API from a client, we make either a query request or mutation request. So how are they created in the first place?

    The setup of a GraphQL API involves defining two very important things which work in unison, and form what's known as a schema.:

        Type definitions: Type definitions, or TypeDefs for short, involves literally defining every piece of data that the client can expect to work with through a query or mutation. Every GraphQL API starts with defining this data, as this type of strict type definition will give the client more clarity as to what they are asking for and what they can expect in return. Think of this as not only defining the API endpoint, but also defining the exact data and parameters that are tied to that endpoint.

        Resolvers: Resolvers are simply the functions we connect to each query or mutation type definition that perform the CRUD actions that each query or mutation is expected to perform.
            
            -  the apollo-server library passes argument data so we can have a more dynamic interaction with our server. A resolver can accept four arguments in the following order:

                parent: This is if we used nested resolvers to handle more complicated actions, as it would hold the reference to the resolver that executed the nested resolver function. We won't need this throughout the project, but we need to include it as the first argument.

                args: This is an object of all of the values passed into a query or mutation request as parameters. In our case, we destructure the username parameter out to be used.

                context: This will come into play later. If we were to need the same data to be accessible by all resolvers, such as a logged-in user's status or API access token, this data will come through this context parameter as an object.

                info: This will contain extra information about an operation's current state. This isn't used as frequently, but it can be implemented for more advanced uses.
        
    - GraphQL has built-in data types known as scalars. Scalars work similarly to how we defined data in Mongoose using JavaScript's built-in types, but there are some differences that we'll learn about as we go.

Apollo Server (Links to an external site.) is an open-source, spec-compliant GraphQL server that's compatible with any GraphQL client, including Apollo Client (Links to an external site.), the client you’ll use in your MERN application. You’ll use the apollo-server-express (Links to an external site.) package to integrate GraphQL into your Express.js server, and the @apollo/client (Links to an external site.) package to make requests from your React front end to the GraphQL API.
    
    - ```!``` - Places after the query parameter data type definitions and indicates that for that query to be carried out, that data must exist. Otherwise, Apollo will return an error to the client making the request and the query won't even reach the resolver function associated with it.

Apollo Client (@apollo/client) is an all-in-one dependency that enables us to connect to a GraphQL API server and execute queries or mutations using their own special form of React Hooks.
    
    ApolloProvider is a special type of React component that we'll use to provide data to all of the other components.

    ApolloClient is a constructor function that will help initialize the connection to the GraphQL API server.

    InMemoryCache enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently.

    createHttpLink allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests.

React Router (Links to an external site.) is a collection of navigational components that compose declaratively with your application, allowing you to make your single-page React applications behave more like multi-page applications. You’ll use the react-router-dom (Links to an external site.) npm package to work with React Router in your applications.

The concurrently (Links to an external site.) npm package allows you to run multiple processes, or servers, from a single command-line interface. Rather than opening multiple terminals to start the multiple servers, you can run them both at the same time. It also allows you to keep track of different outputs in one place, and will stop all of your processes if even one of them fails.

JSON Web Tokens, or JWTs, are an alternative to using session cookies for authentication. You’ll use the jsonwebtoken (Links to an external site.) package in your MERN applications.
    - If the client saves the JWT somewhere (like in localStorage), then the token can be included with certain requests for the back end to validate. For example, the front end might call a GraphQL query called me and expect the logged-in user's full details as the response.

    - You can include the token with a request in the following ways:

        1. As part of the body

        2. In the query string (e.g., ?token=abc)

        3. As an HTTP header
            - An HTTP header is best practice. For this very purpose, official authorization headers prevent cluttering the body and query string with data outside their scope.

jwt-decode (Links to an external site.) is an npm package that helps decode JWTs from their Base64Url encoding. You’ll use it to extract non-sensitive data such as the token’s expiration date to see if it’s expired before making a request to the server.

The faker (Links to an external site.) npm package allows you to generate massive amounts of fake data in the development environment of your Node.js applications.

The nodemon (Links to an external site.) package simplifies your development environment by automatically restarting your Node.js applications when file changes in the directory are detected.

Optional chaining negates the need to check if an object even exists before accessing its properties.