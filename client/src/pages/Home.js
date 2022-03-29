import React from 'react';
// The useQuery Hook from Apollo Client will allow us to make requests to the GraphQL server we connected to and made available to the application using the <ApolloProvider> component in App.js
import { useQuery } from '@apollo/client'
import { QUERY_THOUGHTS } from '../utils/queries';
import ThoughtList from '../components/ThoughtList';

const Home = () => {
  // use useQuery hook to make query request to the GraphQL server
  // With the loading property, we'll be able to conditionally render data based on whether or not there is data to even display.
  // we'll get the thought data out of the query's response, because every GraphQL response comes in a big data object. 
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  // What we're saying is, if data exists, store it in the thoughts constant we just created. If data is undefined, then save an empty array to the thoughts component.
  // if we type data.thoughts, we'll receive an error saying we can't access the property of data—because it is undefined.
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>
          {/* we use a ternary operator to conditionally render the <ThoughtList> component. */}
          {loading ? (
            // If the query hasn't completed and loading is still defined, we display a message to indicate just that.
            <div>Loading...</div>
          ) : (
            // Once the query is complete and loading is undefined, we pass the thoughts array and a custom title to the <ThoughtList> component as props.
            <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
