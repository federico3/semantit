import React from 'react';

const SemantleHintsForm = ({new_hint_creator, remaining_hints, max_hints}) =>
{
    let _hint_button = <span><b>{remaining_hints}</b> suggerimenti rimasti.</span>
    let hint_phrase = (remaining_hints>1?"suggerimenti rimasti":"suggerimento rimasto");
    if (remaining_hints>0){
        _hint_button =
            <form id="hint_form" onSubmit={new_hint_creator}>
                <input id="hint_button" type="submit" value="Suggerisci 🎊"/>
                &nbsp;<b>{remaining_hints}</b> {hint_phrase}.
            </form>
    } else {

    }
    return(
        <div id="hint_div">
            {_hint_button}
        </div>
    );
};

export default SemantleHintsForm;
