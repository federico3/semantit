import React, { Component } from 'react';

const SemantleInputForm = ({input_updater, on_change_updater}) =>
{
    return(
        <form onSubmit={input_updater}>
        <input
            type="text"
            id="guess"
            placeholder="Parola"
            name="guess"
            autoCorrect="off"
            autoCapitalize="none"
            autoComplete="off"
            onChange={on_change_updater}
        />
        <input id="guess_button" type="submit" value="Indovina"/>
        </form>
    );
};

export default SemantleInputForm;
