import React from 'react';
// The useQuery Hook from Apollo Client will allow us to make requests to the GraphQL server we connected to and made available to the application using the <ApolloProvider> component in App.js
import { useQuery } from '@apollo/client'
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
import Auth from '../utils/auth';

import ThoughtForm from '../components/ThoughtForm';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';

const Home = () => {
  // use useQuery hook to make query request to the GraphQL server
  // With the loading property, we'll be able to conditionally render data based on whether or not there is data to even display.
  // we'll get the thought data out of the query's response, because every GraphQL response comes in a big data object. 
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  // use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive.
  // Now if the user is logged in and has a valid token, userData will hold all of the returned information from our query
  const { data: userData } = useQuery(QUERY_ME_BASIC);

  // What we're saying is, if data exists, store it in the thoughts constant we just created. If data is undefined, then save an empty array to the thoughts component.
  // if we type data.thoughts, we'll receive an error saying we can't access the property of data—because it is undefined.
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  const loggedIn = Auth.loggedIn();

  return (
    <main>
      <div className='flex-row justify-space-between'>
        {/* a short-circuit expression to conditionally render ThoughtForm */}
        {loggedIn && (
          <div className="col-12 mb-3">
            <ThoughtForm />
          </div>
        )}
        {/* We're conditionally defining the layout for this <div></div> */} 
        {/* If the user isn't logged in, it'll span the full width of the row. But if you the user is logged in, it'll only span eight columns, leaving space for a four-column <div> on the righthand side. */}
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {/* we use a ternary operator to conditionally render the <ThoughtList> component. */}
          {loading ? (
            // If the query hasn't completed and loading is still defined, we display a message to indicate just that.
            <div>Loading...</div>
          ) : (
            // Once the query is complete and loading is undefined, we pass the thoughts array and a custom title to the <ThoughtList> component as props.
            <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
          )}
        </div>
        {loggedIn && userData ? (
          <div className='col-12 col-lg-3 mb-3'>
            <FriendList
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
              />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Home;
