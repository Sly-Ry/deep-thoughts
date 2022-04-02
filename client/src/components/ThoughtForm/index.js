import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';
import { ADD_THOUGHT } from '../../utils/mutations';

const ThoughtForm = () => {
    const [thoughtText, setText] = useState('');
    const [characterCount, setCharacterCount] = useState(0);

    // The addThought() function will run the actual mutation.
    // The error variable will initially be undefined but can change depending on if the mutation failed.
    const [addThought, { error }] = useMutation(ADD_THOUGHT, {
        // AddThought represents the new thought that was just created. 
        // Using the cache object, we can read what's currently saved in the QUERY_THOUGHTS cache and then update it with writeQuery() to include the new thought object.
        // You usually only have to manually update the cache when adding or deleting items from an array. You won't need to perform any cache updates for the next feature, the Add Reaction form.
        update(cache, { data: { addThought } }) {
            try {
                // could potentially not exist yet, so wrap in a try...catch
                const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
                cache.writeQuery({
                    query: QUERY_THOUGHTS,
                    data: { thoughts: [addThought, ...thoughts] }
                });
            } 
            catch (e) {
                console.error(e);
            }
        
            // update me object's cache, appending new thought to the end of the array
            const { me } = cache.readQuery({ query: QUERY_ME });
            cache.writeQuery({
                query: QUERY_ME,
                data: { me: { ...me, thoughts: [...me.thoughts, addThought] } }
            });
        }
    });

    // Eventually you can't type anything else in the <textarea> element, because the handleChange() function stops updating the value of thoughtText once the character count reaches 280
    const handleChange = event => {
        if (event.target.value.length <= 280) {
            setText(event.target.value);
            setCharacterCount(event.target.value.length);
        }
    };

    // The handleFormSubmit() function to use the addThought() mutation.
    const handleFormSubmit = async event => {
        event.preventDefault();

        try {
            // add thought to database
            await addThought({
            variables: { thoughtText }
            });

            // clear form value
            setText('');
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
        <form
            className="flex-row justify-center justify-space-between-md align-stretch"
            onSubmit={handleFormSubmit}
        >
            <textarea
                placeholder="Here's a new thought..."
                value={thoughtText}
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

export default ThoughtForm;