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
    //remove stopWords
    const stopWordsRemoved = removeStopwords(text.split(' '));
    //clean text
    const cleanedText = clean(stopWordsRemoved.join(' '));
    //apply stemming
    const stemmedText = stemmerWithSplit(cleanedText);
    //split by tokens
    return tokenization(stemmedText, number);
};

export default index;