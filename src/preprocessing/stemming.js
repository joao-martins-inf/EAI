//const { stemmer } = require('stemmer');
import {stemmer} from "stemmer";
import nGram from './tokenization.js';
//const nGram = require('./tokenization');

export const stemmerWithSplit = (text) => {
    const arr = [];

    text.split(' ').map((word) => {
        arr.push(stemmer(word))
    })
}

export const stemmerWithNgram = (text, n) => {
    const arr = [];

    nGram(text, n).map((word) => {
        arr.push(stemmer(word))
    })
}