/**
 * @module tokenization
 */
import { nGram } from 'n-gram';

/**
 *
 * @param input {string[]} text
 * @param n {number} n
 * @returns {string[][]} possible combinations
 */
const ngram = (input, n) => {
    return nGram(n)(input);
}

export default ngram;