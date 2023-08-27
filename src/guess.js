import React from 'react';
import './guess.css';

const TempWidget = ({similarity, rank}) =>
{
    let status="🧊";
    if (similarity>0) {
        status="🥶";
    }
    if (rank<1000) {
        status="😎";
    }
    if (rank<100) {
        status="🥵";
    }
    if (rank<10) {
        status="🔥";
    }
    if (rank<2) {
        status="😱";
    }
    if (rank===0) {
        status="🥳";
    }
    return status;
    
}

const ProgressWidget = ({rank}) =>
{
    if (rank<1000) { /* https://stackoverflow.com/questions/41429906/how-to-display-data-label-inside-html5-progress-bar-cross-browser */
        return (
            <div className="progress" data-label={(1000-rank)+"/1000"}>
                <span className="value" style={{width: (1000-rank)/10+"%"}}></span>
            </div>
        ); 
    }   else {
        return "";
    }   
}

const SemantleGuess = ({semantle_word_guess, number, highlight, hint}) =>
{
    let font_weight = "normal";
    let font_color = "#000"
    let guess_class="guesses"
    if (highlight){
        // font_weight = "bold";
        // font_color = "rgb(0 0 255)"
        guess_class="guesses guesses_highlighted"
    }
    if (hint) {
        guess_class += " guesses_hinted"
    }
    // else if (highlight === 2) {
    //     // font_weight = "bold";
    //     // font_color = "rgb(0 255 255)"
    //     guess_class="guesses guesses_highlighted guesses_hinted"
    // } 
    return(
        <tr key={semantle_word_guess.r}>
            <th className={guess_class} key="guess_number" >{number}</th>{/*Guess number*/}
            <th className={guess_class} key="word" >{semantle_word_guess.w}</th>{/* Guess */}
            <th key="similarity">{semantle_word_guess.s}</th>{/* Similarity */}
            <th key="temperature"><TempWidget similarity={semantle_word_guess.s} rank={semantle_word_guess.r}/></th>{/* Temperature */}
            <th key="progress"><ProgressWidget rank={semantle_word_guess.r}/></th>{/* How close */}
      </tr>
    );
};

export default SemantleGuess;
