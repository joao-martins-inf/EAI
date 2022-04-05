//const { stemmer } = require('stemmer');
import {stemmer} from "stemmer";
import nGram from './tokenization.js';
//const nGram = require('./tokenization');

export const stemmerWithSplit = (text) => {
    return text.split(' ').map((word) => {
        return stemmer(word)
    })
}

export const stemmerWithNgram = (text, n) => {
    return nGram(text, n).map((word) => {
        return stemmer(word)
    });
}