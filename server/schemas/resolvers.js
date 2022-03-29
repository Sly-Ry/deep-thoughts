const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // get current user
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('thoughts')
                    .populate('friends');
                
                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },  
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
    },
    Mutation: {
        // Add a user
        addUser: async(parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        // Add a thought
        addThought: async(parant, args, context) => {
            // Only logged-in users should be able to use this mutation, hence why we check for the existence of context.user first. 
            if (context.user) {
                // The token includes the user's username, email, and _id properties, which become properties of context.user and can be used in the follow-up Thought.create() and User.findByIdAndUpdate() methods.
                const thought = await Thought.create({ ...args, username: context.user.username});

                // Remember, without the { new: true } flag in User.findByIdAndUpdate(), Mongo would return the original document instead of the updated document.
                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { thoughts: thought._id } },
                    { new: true }
                );

                return thought;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        // Add a reaction
        addReaction: async (parent, { thoughtId, reactionBody }, context) => {
            if (context.user) {
                const updatedThought = await Thought.findOneAndUpdate(
                    // Because you're updating an existing thought, the client will need to provide the corresponding thoughtId. 
                    { _id: thoughtId },
                    // Reactions are stored as arrays on the Thought model, so you'll use the Mongo $push operator. 
                    { $push: { reactions: { reactionBody, username: context.user.username } } },
                    { new: true, runValidators: true }
                );

                return updatedThought;
            }
            throw new Authentication('You need to be logged in!');
        },
        // Add a friend
        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                // This mutation will look for an incoming friendId and add that to the current user's friends array
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    // A user can't be friends with the same person twice, though, hence why we're using the $addToSet operator instead of $push to prevent duplicate entries.
                    { $addToSet: { friends: friendId } },
                    { new: true }
                ).populate('friends');

                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        // login authentication
        login: async(parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Invalid credentials');
            }

            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw) {
                throw new AuthenticationError('Invalid credentials');
            }

            const token = signToken(user);
            return { token, user };
        }
    }
};
module.exports = resolvers;
