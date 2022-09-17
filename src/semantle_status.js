import React, { useState } from 'react';

const SemantleStatus = ({semantle_status_props}) =>
{
    return(
        <div>
        <div id="semantle_status">
            {semantle_status_props.info}
        </div>
        <div id="semantle_error">
            {semantle_status_props.error}
        </div>
        </div>
    );
};

const SemantleInfo = ({semantle_status_props}) =>
{
    let [blurState, setBlurState] = useState("blurry");
    let [historyState, setHistoryState] = useState("hidden");
    const updateBlurState = (event)=>{(blurState === "blurry" ? setBlurState("uncovered"): setBlurState("blurry"))};
    const updateHistoryState = (event)=>{(historyState === "hidden" ? setHistoryState("visible"): setHistoryState("hidden"))};
    return(
        <div>
        <div id="semantle_info">
            Il puzzle di oggi è il numero <b>{semantle_status_props.puzzle_number}</b>.
            La parola più vicina ha una similarità di <b>{semantle_status_props.nearest_word_similarity}</b>;
            la decima parola più vicina ha una similarità di {semantle_status_props.tenth_nearest_word_similarity}; 
            e la millesima parola più vicina ha una similarità di {semantle_status_props.thousandth_nearest_word_similarity}. 
        </div>
        <div id="semantle_history">
            La parola di ieri era 
            <span className={blurState} id="yesterdaysWord" onClick={updateBlurState}> "{semantle_status_props.yesterdays_word}"</span>. 
            <span className='updateHistoryStateController' onClick={updateHistoryState}> [{historyState==="hidden" ? "+": "-"}]</span>
            <span className={historyState} id='yesterdaysWords'> Le dieci parole più vicine a 
            <span className={blurState} onClick={updateBlurState}> "{semantle_status_props.yesterdays_word}" </span>
            erano 
            <span className={blurState}onClick={updateBlurState}> {semantle_status_props.yesterdays_words}</span>.</span>
        </div>
        </div>
    );
};

export {SemantleInfo, SemantleStatus};
