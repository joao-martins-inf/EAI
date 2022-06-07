/**
 * @module stopwords
 */
import { removeStopwords, eng } from 'stopword';
import stopwords from './stopwordsList.js';

/**
 * @method
 * @param {array<string>} input
 * @returns {*}
 */
export default (input) => {
    const removedStopwords = removeStopwords(input, eng);
    return removedStopwords.reduce((acc, curr) => {  
        const exists = stopwords.indexOf(curr);
        if (exists === -1) acc.push(curr);
        return acc;
      }, []);
}