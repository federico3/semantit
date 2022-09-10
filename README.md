# Semantix

An open-source version of [Semantle](semantle.com)/[Cémantix](https://cemantix.herokuapp.com/) developed in React.

## Embeddings

We use pre-trained Italian word embeddings from [fastText](https://fasttext.cc).

## Word list

We use the word list from [Napolux](https://github.com/napolux/paroleitaliane). The list of 1k common words is used for solutions, and the list of 95k words is used to screen for valid words.

## Usage

The Jupyter notebook in `backend/Semantle_generator` creates `.json` files with word embeddings. The files should be copied in the `public` folder of the frontend. All other computations occur in the frontend.
