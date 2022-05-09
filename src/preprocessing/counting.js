/**
 * gives the number of time a word exists in a text
 * @param text {string} text
 * @returns {number} number of words in param
 */
export function words(text) {
    return text.split(' ').length;
}

/**
 * gives the number of times a char exists in a text
 * @param text {string} text
 * @returns {number} number of times a char exists in a text
 */
export function characters(text) {
    return text.length;
}

/**
 * Number of occurrences of a term in a text
 * @param term {string} term
 * @param text {string} text
 * @returns {number} number of occurrences of a term in a text
 */
export function numberOfOccurrences(term, text) {
    return text.split(' ').reduce((total, item) => {
        return item === term ? total += 1 : total;
    }, 0);
}

/**
 * Checks if a term exists in a text
 * @param term {string} term
 * @param text {string} text
 * @returns {boolean} true if exists false if not
 */
export function exists(term, text) {
    return text.includes(term)
}

/**
 * Term frequency of a term in a text
 * @param term {string} term
 * @param text {string} text
 * @returns {number} term frequency value
 */
export function tf(term, text) {
    //TODO não está preparado para bigramas PROBLEM: words
    return numberOfOccurrences(term, text) / words(text);
}

/**
 *
 * @param nDocs {number} number of documents
 * @param value {number} d(t)
 * @returns {number} inverse document frequency
 */
export function idf(nDocs, value) {
    return Math.log(nDocs / value);
}

/**
 * term frequency - inverse document frequency
 * @param tf {number} term frequency
 * @param idf {number} inverse document frequency
 * @returns {number} term frequency - inverse document frequency
 */
export function tfidf(tf, idf) {
    return tf * idf;
}