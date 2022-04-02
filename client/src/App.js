import React from 'react';
import { 
  ApolloProvider, 
  ApolloClient, 
  InMemoryCache, 
  createHttpLink 
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';

// We renamed BrowserRouter to Router to make it easier to work with.
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';


// we first establish a new link to the GraphQL server at its /graphql endpoint with createHttpLink()
const httpLink = createHttpLink({
  // URI stands for "Uniform Resource Identifier."
  uri: '/graphql',
});

// With the configuration of authLink, we use the setContext() function to retrieve the token from localStorage and set the HTTP request headers of every request to include the token, whether the request needs it or not. This is fine, because if the request doesn't need the token, our server-side resolver function won't check for it.
// Because we're not using the first parameter, but we still need to access the second one, we can use an underscore _ to serve as a placeholder for the first parameter.
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// After we create the link, we use the ApolloClient() constructor to instantiate the Apollo Client instance and create the connection to the API endpoint.
const client = new ApolloClient({
  // we need to combine the authLink and httpLink objects so that every request retrieves the token and sets the request headers before making the request to the API.
    link: authLink.concat(httpLink),
    // We also instantiate a new cache object using new InMemoryCache(). We could customize this to the application, but by default, it works well for this purpose
    cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className='flex-column justify-flex-start min-100-vh'>
          <Header />
          <div className='container'>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/profile/:username?" component={Profile} />
              <Route exact path="/thought/:id" component={SingleThought} />
              
              <Route component={NoMatch} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
