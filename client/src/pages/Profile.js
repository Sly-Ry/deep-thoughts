import React from 'react';
// Redirect will allow us to redirect the user to another route within the application.
// Think of it like how we've used location.replace() in the past, but it leverages React Router's ability to not reload the browser! 
import { Redirect, useParams } from 'react-router-dom';

import ThoughtForm from '../components/ThoughtForm';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';

import { ADD_FRIEND } from '../utils/mutations';

import Auth from '../utils/auth';

const Profile = (props) => {
  const { username: userParam } = useParams();

  // On component load, the useParams() Hook will have a value if it's another user's profile and won't have a value if it's ours.
  // Now if there's a value in userParam that we got from the URL bar, we'll use that value to run the QUERY_USER query. If there's no value in userParam, like if we simply visit /profile as a logged-in user, we'll execute the QUERY_ME query instead.
  const { loading, data } = useQuery(userParam ? QUERY_USER: QUERY_ME, {
    variables: { username: userParam }
  });

  const [addFriend] = useMutation(ADD_FRIEND);

  // Handles each type of response by changing it to look like the following code
  const user = data?.me || data?.user || {};

  // With this, we're checking to see if the user is logged in and if so, if the username stored in the JSON Web Token is the same as the userParam value. If they match, we return the <Redirect> component with the prop to set to the value /profile, which will redirect the user away from this URL and to the /profile route.
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Redirect to="/profile" />;
  };

  if (loading) {
    return <div>Loading...</div>;
  };

  // If there is no user data to display, we know that we aren't logged in or at another user's profile page. Instead of redirecting the user away, we simply inform them that they need to be logged in to see this page and they must log in or sign up to use it.
  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to view this page. Use the navigation links above to sign up or log in, ya dork.
      </h4>
    );
  };

  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>
        {/* With these changes, the userParam variable is only defined when the route includes a username (e.g., /profile/Marisa86). Thus, the button won't display when the route is simply /profile. */}
        {userParam && (
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts...`} />
        </div>
        <div className="col-12 col-lg-3 mb-3">
          <FriendList
          username={user.username}
          friendCount={user.friendCount}
          friends={user.friends}
          />
        </div>
      </div>

      <div className="mb-3">{!userParam && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;

// As you befriend more users and route from Profile back to Home, notice that the homepage instantly reflects the change. There's no need to re-request any information from the server, because the Apollo Client caches query results and updates the cache whenever mutations are made. Paired with the useQuery Hook, these changes automatically re-render your components.

// In this case, the addFriend() mutation returns an updated user object whose ID matches the me object already stored in cache. When the cache is updated, the useQuery(QUERY_ME_BASIC) Hook on the homepage causes a re-render.