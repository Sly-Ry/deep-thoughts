import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import { ADD_REACTION } from '../../utils/mutations';

const ReactionForm = ({ thoughtId }) => {
    const [reactionBody, setBody] = useState('');
    const [addReaction, { error }] = useMutation(ADD_REACTION);

    const [characterCount, setCharacterCount] = useState(0);

    const handleChange = event => {
        if (event.target.value.length <= 280) {
            setBody(event.target.value);
            setCharacterCount(event.target.value.length);
        }
    };

    const handleFormSubmit = async event => {
        event.preventDefault();

        try {
            // add reaction to database
            await addReaction({
            variables: { reactionBody, thoughtId }
            });

            // clear form value
            setBody('');
            setCharacterCount(0);
        } 
        catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}>
                Character Count: {characterCount}/280
                {error && <span className="ml-2">Something went wrong...</span>}
            </p>
            <form className="flex-row justify-center justify-space-between-md align-stretch" onSubmit={handleFormSubmit}>
                <textarea
                    placeholder="Here's a new reaction..."
                    value={reactionBody}
                    className="form-input col-12 col-md-9"
                    onChange={handleChange}
                ></textarea>

                <button className="btn col-12 col-md-3" type="submit">
                Submit
                </button>
            </form>
        </div>
    );
};

export default ReactionForm;

// Because the ThoughtForm and ReactionForm components are so similar, you could combine them into a more generic Form component to make your code more DRY. Doing so would involve passing in a few more props, though. For example, one prop could be a callback function that runs the necessary mutation. That way, the Form component itself wouldn't need to import useMutation. It would be part of the parent component and used in the callback.