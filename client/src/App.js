import React from 'react';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';

import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// we first establish a new link to the GraphQL server at its /graphql endpoint with createHttpLink()
const httpLink = createHttpLink({
  // URI stands for "Uniform Resource Identifier."
  uri: '/graphql',
});

// After we create the link, we use the ApolloClient() constructor to instantiate the Apollo Client instance and create the connection to the API endpoint.
const client = new ApolloClient({
  link: httpLink,
  // We also instantiate a new cache object using new InMemoryCache(). We could customize this to the application, but by default, it works well for this purpose
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className='flex-column justify-flex-start min-100-vh'>
        <Header />
        <div className='container'>
          <Home />
        </div>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
