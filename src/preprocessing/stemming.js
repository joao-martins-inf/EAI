import {stemmer} from "stemmer";
import nGram from './tokenization.js';

/**
 * converts ethe text to his base form (split)
 * @param text {string} text
 * @returns {string[]}
 */
export const stemmerWithSplit = (text) => {
    return text.split(' ').map((word) => {
        return stemmer(word)
    })
}

/**
 * converts ethe text to his base form (n-gram)
 * @param text {string[]} text
 * @param n {number} n-gram value
 * @returns {string[][]}
 */
export const stemmerWithNgram = (text, n) => {
    //TODO this function prob doesnt work
    return nGram(text, n).map(wordList => {
        return wordList.map(word => {
            return stemmer(word)
        })
    });
}