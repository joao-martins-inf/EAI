/**
 * array containing all the strings
 * @typedef {Array<Array<string>>} n
 */

/**
 * Processed docs
 * @typedef {object} processed
 * @property {n} n1 unigram string list
 * @property {n} n2 bigram string list
 * @property {number} id documentid
 */


/**
 * @typedef {Object} vector
 * @property {string} label
 * @property {Array} bagOfWords
 * @property {Array[number]} tfidf
 * @property {Array[number]} idf
 */
// etc...