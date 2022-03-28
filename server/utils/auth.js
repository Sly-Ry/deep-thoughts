const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhh';
const expiration = '2h';

module.exports = {
    // The signToken() function expects a user object and will add that user's username, email, and _id properties to the token. 
    // Optionally, tokens can be given an expiration date and a secret to sign the token with. 
    // If your JWT secret is ever compromised, you'll need to generate a new one, immediately invalidating all current tokens. Because the secret is so important, you should store it somewhere other than in a JavaScript file—like an environment variable.
    signToken: function({ username, email, _id }) {
        const payload = {username, email, _id};
        // Note that the secret has nothing to do with encoding. The secret merely enables the server to verify whether it recognizes this token.
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    }
}