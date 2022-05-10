/**
 * @module stopwords
 */
import { removeStopwords, eng } from 'stopword';

/**
 * @method
 * @param {array<string>} input
 * @returns {*}
 */
export default (input) => {
    return removeStopwords(input, eng);
}