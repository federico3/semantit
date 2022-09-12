# Semant🇮🇹it

An open-source version of [Semantle](semantle.com)/[Cémantix](https://cemantix.herokuapp.com/) developed in React and using a database of Italian words.

## Embeddings

We use pre-trained Italian word embeddings from [fastText](https://fasttext.cc).

## Word list

The list of 1k common words from [Napolux](https://github.com/napolux/paroleitaliane) is used for acceptable solutions. The [list of words in Debian's Italian spell checker](https://packages.debian.org/sid/witalian) is used to screen for valid words.

## Usage

The Jupyter notebook in `backend/Semantle_generator` creates `.json` files with word embeddings. The files should be copied in the `public` folder of the frontend. All other computations occur in the frontend.
