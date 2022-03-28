const { User, Thought } = require('../models');

const resolvers = {
    Query: {
        // get all users
        users: async () => {
            return User.find()
                // Both of them will omit the Mongoose-specific '__v' property and the user's password information, which doesn't ever have to return anyway. 
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts');
        },
        // get a user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts');
        },
        // Here, we pass in the parent as more of a placeholder parameter. It won't be used, but we need something in that first parameter's spot so we can access the username argument from the second parameter. 
        thoughts: async (parent, { username }) => {
            // We use a ternary operator to check if username exists. If it does, we set params to an object with a username key set to that value. If it doesn't, we simply return an empty object.
            const params = username ? { username } : {};
            // We then pass that object, with or without any data in it, to our .find() method. If there's data, it'll perform a lookup by a specific username. If there's not, it'll simply return every thought.
            return Thought.find(params).sort({ createdAt: -1});
        },
        // similar to how we handled thoughts, we destructure the _id argument value and place it into our .findOne() method to look up a single thought by its _id.
        thought: async (parent, { _id }) => {
            return Thought.findOne({ _id });
        }
    }
};

module.exports = resolvers;
