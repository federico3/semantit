import React, { Component } from 'react';
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

const SemantleGuess = ({semantle_word_guess, number, highlight}) =>
{
    let font_weight = "normal";
    let font_color = "#000"
    if (highlight){
        font_weight = "bold";
        font_color = "rgb(0 0 255)"
    }
    return(
        <tr key={semantle_word_guess.r}>
            <th key="guess_number" style={{fontWeight: font_weight, color: font_color}}>{number}</th>{/*Guess number*/}
            <th key="word" style={{fontWeight: font_weight, color: font_color}}>{semantle_word_guess.w}</th>{/* Guess */}
            <th key="similarity">{semantle_word_guess.s}</th>{/* Similarity */}
            <th key="temperature"><TempWidget similarity={semantle_word_guess.s} rank={semantle_word_guess.r}/></th>{/* Temperature */}
            <th key="progress"><ProgressWidget rank={semantle_word_guess.r}/></th>{/* How close */}
      </tr>
    );
};

export default SemantleGuess;
