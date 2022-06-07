/**
 * @module preprocess
 */
import clean from './clean.js';
import tokenization from './tokenization.js';
import removeStopwords from './stopwords.js';
import {stemmerWithSplit} from './stemming.js';

/**
 * Does all the preprocessing steps
 * @param text {string} text
 * @param number {number} n-gram value
 * @returns {string[][]}
 */
const index = (text, number) => {
    //clean text
    const cleanedText = clean(text);
    //remove stopWords
    const stopWordsRemoved = removeStopwords(cleanedText.split(' '));
    //apply stemming
    const stemmedText = stemmerWithSplit(stopWordsRemoved.join(' '));
    //split by tokens
    return tokenization(stemmedText, number);
};

export default index;