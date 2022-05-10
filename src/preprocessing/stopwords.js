/**
 * @module stopwords
 */
import { removeStopwords, eng } from 'stopword';

/**
 * @method
 * @param {string} input
 * @returns {*}
 */
export default (input) => {
    return removeStopwords(input, eng);
}