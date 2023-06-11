#!/bin/bash
mkdir -p data
cd data

git clone https://github.com/napolux/paroleitaliane.git

wget https://dl.fbaipublicfiles.com/fasttext/vectors-crawl/cc.it.300.bin.gz
gzip -d cc.it.300.bin.gz
mkdir -p wiki.it
cd wiki.it
wget https://dl.fbaipublicfiles.com/fasttext/vectors-wiki/wiki.it.zip
unzip wiki.it.zip



