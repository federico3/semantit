import React, { Component }  from 'react';
import {SemantleGuesses, SemantleGuessed} from './guesses';
import {SemantleStatus, SemantleInfo} from './semantle_status';
import SemantleInputForm from './input_form';
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import MatomoTracker from '@jonkoops/matomo-tracker'

class Semantle extends React.Component {
    constructor(props) {
        super(props);
        
        // const { trackPageView, trackEvent } = useMatomo();
        this.tracker = new MatomoTracker({urlBase: 'https://matomo.federico.io/matomo/', siteId: 2})
        const dateiso = new Date().toISOString().slice(0,10);
        console.log(new Date().toISOString());
        // let datestr = today.toString();

        // React.useEffect(() => {
        //     trackPageView()
        //   }, [])

        this.state = {
            date: dateiso,
            word_database: {},
            day_stats: {
                puzzle_number: -1,
                nearest_word_similarity: -1,
                tenth_nearest_word_similarity: -1,
                thousandth_nearest_word_similarity: -1,
            },
            player_stats: {
                days_played: 0,
                mean_number_of_guesses: 0,
                min_number_of_guesses: Number.MAX_SAFE_INTEGER,
                max_number_of_guesses: 0,
                streak: 0,
            },
            closest_words_list: [],
            latest_guess: "",
            solution_word: "",
            solved: false,
            guesses: {
            },
            guess_number: 0,
            error: "",
            info: "Sto caricando le parole di oggi...",
        }

        // this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const default_init=false;
        this.tracker.trackPageView({});
        
        if (default_init) {
            this.setState(
                {
                    word_database: {
                        "maple":
                            {
                                s:100,
                                r: 0,
                            },
                        "aaron":
                            {
                                s: 3,
                                r: 300,
                            },
                        "acorn":
                            {
                                s: -1,
                                r: 1200,
                            },
                        "tepid": 
                            {
                                s: 17.2,
                                r: 50,
                            },
                    },
                    closest_words_list: [
                            {
                                w: "maple",
                                s:100,
                                r: 0,
                            },
                            {
                                w: "tepid",
                                s: 17.2,
                                r: 50,
                            },
                            {
                                w: "aaron",
                                s: 3,
                                r: 300,
                            },

                            {
                                w: "acorn",
                                s: -1,
                                r: 1200,
                            },
                        ],
                    solution_word: "",
                    info: "Fetched DB locally",
                    day_stats: {
                        puzzle_number: -1,
                        nearest_word_similarity: -1,
                        tenth_nearest_word_similarity: -1,
                        thousandth_nearest_word_similarity: -1,
                    }
                },
            )
        } else {
            fetch(process.env.PUBLIC_URL +"/"+this.state.date+"/semantle.json")
            .then(res => res.json())
            .then(
            (result) => {
                this.setState({
                    word_database: result.word_database,
                    closest_words_list: result.closest_words_list,
                    solution_word: result.solution_word,
                    info: "",
                    day_stats: result.day_stats,

                });
            },
            (error) => {
                console.log(error);
                this.setState({
                //     word_database: {},
                //     closest_words_list: [],
                //     solution_word: "",
                //     info: "",
                //     day_stats: {
                //         puzzle_number: 10,
                //         nearest_word_similarity: 37,
                //         tenth_nearest_word_similarity: 21,
                //         thousandth_nearest_word_similarity: 5,
                //     },
                    error: "Errore nel caricare le parole di oggi! " + error
                });
            }
            );
        }

        const gameState = JSON.parse(localStorage.getItem("gameState"));

        if (gameState){
            const gameStateDate = gameState.date;
            let _player_streak = 0;
            if (gameStateDate === this.state.date) {
                this.setState(
                    {
                        guesses: gameState.guesses,
                        latest_guess: gameState.latest_guess,
                        guess_number: gameState.guess_number,
                        solved: gameState.solved,
                    }
                )
                _player_streak = gameState.player_stats.streak;
            } else if (false) { /*TODO */
                _player_streak = gameState.player_stats.streak;
            } else {
                _player_streak = 0;
            }

            let _player_stats= {
                days_played: gameState.player_stats.days_played,
                mean_number_of_guesses: gameState.player_stats.mean_number_of_guesses,
                min_number_of_guesses: gameState.player_stats.min_number_of_guesses,
                max_number_of_guesses: gameState.player_stats.max_number_of_guesses,
                streak: _player_streak,
            }
            this.setState(
                {
                    player_stats: _player_stats
                }
                )

        }
        
    }

    addWord(new_guess) {
        let _guess_number = this.state.guess_number;
        let _solved = this.state.solved;
        let updated_guesses = this.state.guesses;
        let _player_stats = this.state.player_stats;

        if (new_guess in this.state.word_database){
            _guess_number += 1;
            this.setState({latest_guess: new_guess});
            if (!(new_guess in this.state.guesses)){
                updated_guesses[new_guess] =
                    {
                        guess_number: _guess_number,
                        w: new_guess,
                        s: this.state.word_database[new_guess].s,
                        r: this.state.word_database[new_guess].r,
                    }
                this.setState(
                    {
                        guess_number: _guess_number,
                        guesses: updated_guesses,
                    }
                )
                if (!_solved && this.state.guesses[new_guess]["r"] === 0){
                    _solved = true;
                    _player_stats.days_played += 1;
                    _player_stats.max_number_of_guesses = Math.max(_player_stats.max_number_of_guesses, _guess_number);
                    _player_stats.min_number_of_guesses = Math.min(_player_stats.min_number_of_guesses, _guess_number);
                    _player_stats.mean_number_of_guesses = ((_player_stats.days_played-1)*_player_stats.mean_number_of_guesses+_guess_number)/_player_stats.days_played;
                    _player_stats.streak+=1;
                    this.setState(
                        {
                            solved: _solved,
                            solution_word: new_guess,
                        }
                    );
                }
            }
            this.setState({
                error: null,
            });
            // this.saveProgress();
            const gameState = {
            date: this.state.date,
            guesses: updated_guesses,
            latest_guess: new_guess,
            guess_number: _guess_number,
            solved: _solved,
            player_stats: _player_stats,
        }
        localStorage.setItem("gameState", JSON.stringify(gameState));
        } else {
            this.setState(
                {
                    error: new_guess + " non è una parola valida.",
                    info: null,
                }
            )
        }

    }

    handleSubmit(new_submission) {
        let new_guess = new_submission.target.guess.value.toLowerCase();
        this.addWord(new_guess);
        new_submission.preventDefault();
        new_submission.target.guess.value="";
    }

    handleChange(new_submission) {
        let new_guess = new_submission.target.value;
        this.addWord(new_guess);
        new_submission.preventDefault();
    }

    resetHistory(new_submission){
        localStorage.clear();
    }

    render() {

        let solution_information = "";
        if (this.state.solved) {
            solution_information = <SemantleGuessed
                correct_word={this.state.solution_word}
                guesses={this.state.guesses}
                closest_words_list={this.state.closest_words_list}
                puzzle_number={this.state.day_stats.puzzle_number}
                player_stats={this.state.player_stats}
            />
        }

        return(
            <div>
                <h1>Semantle</h1>
                <div>
                    <SemantleInfo 
                    semantle_status_props={{
                        date: this.state.date,
                        puzzle_number: this.state.day_stats.puzzle_number,
                        nearest_word_similarity: this.state.day_stats.nearest_word_similarity,
                        tenth_nearest_word_similarity: this.state.day_stats.tenth_nearest_word_similarity,
                        thousandth_nearest_word_similarity: this.state.day_stats.thousandth_nearest_word_similarity,
                        error: this.state.error,
                        info: this.state.info,
                    }}
                    />
                    <br/>
                    {solution_information}

                    <SemantleInputForm
                        input_updater={this.handleSubmit}
                        // on_change_updater={this.handleChange}
                    />

                    <SemantleStatus 
                    semantle_status_props={{
                        date: this.state.date,
                        puzzle_number: this.state.day_stats.puzzle_number,
                        nearest_word_similarity: this.state.day_stats.nearest_word_similarity,
                        tenth_nearest_word_similarity: this.state.day_stats.tenth_nearest_word_similarity,
                        thousandth_nearest_word_similarity: this.state.day_stats.thousandth_nearest_word_similarity,
                        error: this.state.error,
                        info: this.state.info,
                    }}
                    />

                    

                    <SemantleGuesses
                        guesses_dict={this.state.guesses}
                        latest_guess={this.state.latest_guess}
                    />
                </div>
                <br/>
                <br/>
                <form onSubmit={this.resetHistory}>
                    <input id="reset_button" type="submit" value=" ⚠️ Reset ⚠️"/>
                </form>
            </div>
        );
    }
}

export default Semantle;
