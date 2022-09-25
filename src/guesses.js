import React, { useState } from 'react';
import SemantleGuess from './guess';
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

const SemantleGuesses = ({guesses_dict, latest_guess}) =>
{
    let guesses_list = [];
    for (var _key in guesses_dict){
        guesses_list.push(guesses_dict[_key])
    }

    const rendered_guesses = guesses_list.sort((a,b)=>{
        return b.s-a.s
    }
    ).map(
        (guess) =>
        <SemantleGuess key={guess.guess_number}
            semantle_word_guess={guess}
            number={guess.guess_number}
            highlight={latest_guess===guess.w}
        />
        )
    
    let latest_guess_on_top = ""

    if (guesses_list.length && latest_guess !== guesses_list[0].w) {
        latest_guess_on_top = <SemantleGuess key={guesses_dict[latest_guess].guess_number}
            semantle_word_guess={guesses_dict[latest_guess]}
            number={guesses_dict[latest_guess].guess_number}
            highlight={true}
        />
    }

    return(
        <table className="styled-table">
            <thead>
                <tr key="header">
                    <th key="guess_number">#</th>{/* Guess number */}
                    <th key="word">Parola</th>{/* Guess */}
                    <th key="similarity">Similarità</th>{/* Similarity */}
                    <th key="temperature">🌡️</th>{/* Temperature */}
                    <th key="progress">Progresso</th>{/* How close */}
                </tr>

                {latest_guess_on_top}
                
            <br/>
            </thead>
            
            <tbody>
                {rendered_guesses}
            </tbody>
        </table>
    );
};

const SemantleGuessed = ({correct_word, guesses, closest_words_list, puzzle_number, player_stats, display_similar_words, toggle_similar_words_display, guesses_to_solve}) => {
    
    /* Go through the word dictionary and pick the top 100 words. 
    For each word, if it is in "guesses", boldface. 
    Do we assume that the word dictionary is ordered somehow? Dicts are not.
    Or maybe we just generate it serverside.
    Also, there is a O(n^2) operation here, which is not ideal.
    */

    const closest_words_annotated = closest_words_list.map(
        (guess) =>
        <SemantleGuess key={guess.r}
            semantle_word_guess={guess}
            number={guess.w in guesses? guesses[guess.w].guess_number : ""}
            highlight={guess.w in guesses}
        />
        )

    const { width, height } = useWindowSize()

    // let celebrate = true;
    let [celebrate, setCelebrate] = useState(true);
    
    const confetti_duration_ms = 5000;
    setInterval(()=>{setCelebrate(false)},confetti_duration_ms);

    return (
        <div id="solution">
            <Confetti
                width={width}
                height={height}
                numberOfPieces={celebrate? 500 : 0}
                recycle={true}
                // onConfettiComplete={confetti => {
                //   setCelebrate(false);
                //   confetti.reset();
                // }}
            />
            Hai indovinato! La parola di oggi è <b> "{correct_word}"</b>.

            <form onSubmit={
                    (_sub)=>{
                        const stats_text = document.getElementById("stats-text");
                        console.log(stats_text.textContent);
                        navigator.clipboard.writeText(stats_text.textContent);
                        _sub.preventDefault();
                    }
                }>
                <input id="share_button" type="submit" value="🥳 Condividi 🎉"/>
            </form>

            {/* <SemantleStatsText guesses={{guesses}} puzzle_number={puzzle_number} guesses_to_solve={guesses_to_solve} /> */}
            {/* <br/> */}
            <div id="stats-text" style={{display: "none"}}>
            <SemantleStatsText guesses={{guesses}} puzzle_number={puzzle_number} guesses_to_solve={guesses_to_solve}/>
            </div>

            <div id="similar-words">
                Ecco le cento parole più vicine a "{correct_word}":
                <button type="button" className="collapsible" onClick={
                    (_sub)=>{
                        toggle_similar_words_display();
                        _sub.preventDefault();
                    }}
                >{display_similar_words==="block" ? "-": "+"}</button>
                <div style={{display: display_similar_words}}>
                    <table className="smaller-table">
                        <thead>
                            <tr key="header">
                                <th key="guess_number">#</th>{/* Guess number */}
                                <th key="word">Parola</th>{/* Guess */}
                                <th key="similarity">Similarità</th>{/* Similarity */}
                                <th key="temperature">🌡️</th>{/* Temperature */}
                                <th key="progress">Progresso</th>{/* How close */}
                            </tr>
                        </thead>
                
                        <tbody>
                            {closest_words_annotated}
                        </tbody>
                    </table>
                </div>
            </div>

        <PlayerStats player_stats={player_stats}/>
        </div>
    )
}

const SemantleStatsData = ({guesses, puzzle_number, guesses_to_solve}) => {
    const ordered_states_list = ["cold", "cool", 1000, 100, 10, 1, 0].reverse()
    // "🧊",
    // "🥶",
    // "😎",
    // "🥵",
    // "🔥",
    // "😱",
    // "🥳",
    const ordered_status_emojis = {
        "cold": "🧊",
        "cool": "🥶",
        1000: "😎",
        100: "🥵",
        10: "🔥",
        1: "😱",
        0: "🥳",
    }

    let stats = {}
    for (let _status_key in ordered_status_emojis) {
        stats[_status_key] = 0;
    }
    
    for (let guess in guesses.guesses){
        if (guesses.guesses[guess].guess_number <= guesses_to_solve){
            if (guesses.guesses[guess].r===0){
                stats[0] += 1;
            } else if (guesses.guesses[guess].r<2) {
                stats[1] += 1;
            } else if (guesses.guesses[guess].r<10) {
                stats[10] += 1;
            } else if (guesses.guesses[guess].r<100) {
                stats[100] += 1;
            } else if (guesses.guesses[guess].r<1000) {
                stats[1000] += 1;
            }
            else if (guesses.guesses[guess].s>0) {
                stats["cool"] += 1;
            } else {
                stats["cold"] += 1;
            }
        }
    }

    return [ordered_states_list, ordered_status_emojis, stats];
}

const SemantleStatsReact = ({guesses, puzzle_number, guesses_to_solve})=> {

    let statsData = SemantleStatsData({guesses, puzzle_number, guesses_to_solve});

    const ordered_states_list=statsData[0], ordered_status_emojis=statsData[1], stats=statsData[2];

    const graphical_stats = ordered_states_list.map((_stat)=>
    {
        return(
        <tr key={_stat}>
            <th>{ordered_status_emojis[_stat].repeat(Math.max(1,Math.ceil(stats[_stat]/10)))}: </th><th>{stats[_stat]}</th>
        </tr> 
        )
    })
    return(
        <div>
            Ho indovinato Semant🇮🇹it #{puzzle_number} in {guesses_to_solve} tentativi!
            <table>
                <tbody>
                    {graphical_stats}
                </tbody>
            </table>
        </div>
    )
}

const SemantleStatsText = ({guesses, puzzle_number, guesses_to_solve})=> {
    // So so ugly!
    if (guesses_to_solve === undefined || guesses_to_solve <1 ){
        let guesses_length = 0;
        for (let i in guesses.guesses) {
            guesses_length += 1;
        }
        guesses_to_solve = guesses_length;
    }

    let statsData = SemantleStatsData({guesses, puzzle_number, guesses_to_solve});

    const ordered_states_list=statsData[0], ordered_status_emojis=statsData[1], stats=statsData[2];

    let textStats = "Ho indovinato Semant🇮🇹it #" +String(puzzle_number)+" in " +guesses_to_solve +" tentativi!\n";

    const textStatsContent = ordered_states_list.map((_stat)=>
        {
            return(
                (ordered_status_emojis[_stat].repeat(Math.max(1,Math.ceil(stats[_stat]/10))) + ": " +  stats[_stat])
            )
        }
    )

    textStatsContent.forEach(st => { textStats += (st + "\n") });
    return textStats;
}

const PlayerStats = ({player_stats}) =>
{
    return(
        <div>
        <div id="semantit_stats">
            <div>
            Parole trovate dall'inizio del gioco: {player_stats.days_played}
            </div>
            <div>
            Numero di tentativi: media {Math.round(player_stats.mean_number_of_guesses*100)/100.}, minimo {player_stats.min_number_of_guesses}, massimo {player_stats.max_number_of_guesses}.
            </div>
            {<div>
            Streak: {player_stats.streak} {(player_stats.streak === 1 ? "giorno" : "giorni")}.
            </div>}
        </div>
        </div>
    );
};

export {SemantleGuesses, SemantleGuessed};
