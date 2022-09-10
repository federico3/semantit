import React from 'react';

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
    return(
        <div>
        <div id="semantle_info">
            Il puzzle di oggi è il numero <b>{semantle_status_props.puzzle_number}</b>.
            La parola più vicina ha una similarità di <b>{semantle_status_props.nearest_word_similarity}</b>;
            la decima parola più vicina ha una similarità di {semantle_status_props.tenth_nearest_word_similarity}; 
            e la millesima parola più vicina ha una similarità di {semantle_status_props.thousandth_nearest_word_similarity}. 
        </div>
        </div>
    );
};

export {SemantleInfo, SemantleStatus};
