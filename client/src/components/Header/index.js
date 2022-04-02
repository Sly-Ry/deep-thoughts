import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../utils/auth';

const Header = () => {
  const logout = event => {
    // With the event.preventDefault(), we're actually overriding the <a> element's default nature of having the browser load a different resource. 
    event.preventDefault();

    // Instead, we execute the .logout() method, which will remove the token from localStorage and then refresh the application by taking the user back to the homepage.
    Auth.logout();
  };

  return (
    <header className="bg-secondary mb-4 py-2 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <Link to="/">
        <h1>Deep Thoughts</h1>
        </Link>

        <nav className="text-center">
          {Auth.loggedIn() ? (
            <>
              <Link to="/profile">Account</Link>
              <a href="/" onClick={logout}>
                Logout
              </a>
            </>
          ) : (
            <>
              <Link to="/login">login</Link>
              <Link to="/signup">signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

// When you log out from the site, the application will completely reload and show the default state of the app's header with the navigation items for a logged-out user. Remember, we also completely remove the token from localStorage upon this action too, so a user has to log back in to gain access to user-based features again.

// Notice how none of this logging-out functionality interacts with the server. This is one of the perks of using JSON Web Tokens. Because the server doesn't keep track of who's logged in, it also doesn't need to know who's trying to leave either. Because of this, we can avoid users making needless requests to the server and seriously reduce the amount of work it has to do.

// One way to think about the use of a JSON Web Token is to compare it to going to a conference or convention. When you arrive at the convention, you usually check in with someone who verifies that you're allowed to be there. If you are, they provide you with some type of identification badge for you to keep on you at all times.

// With that badge, all you have to do is show it to people at the convention and they automatically know that they're the ones who issued it to you and that you're allowed to be there. But when the conference is over, you don't need to let anybody know you're leaving. You simply take your badge off and go on your way.
