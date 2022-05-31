/**
 *
 * @param {Term[]} terms
 * @param {number} k
 * @param {string} metric (binary, occurrences, tf ou tf-idf)
 * @param {boolean} useSum
 * @returns {Term[]} best k terms
 */
export const selectKBest = (terms, k, metric, useSum = true) => {
    // TODO useSum nao sabemos para que serve
    switch (metric) {
        case 'binary':
            return terms.sort((termA, termB) =>
                termB.binary - termA.binary).splice(0, k)
        case 'occurrences':
            return terms.sort((termA, termB) =>
                termB.occurrences - termA.occurrences).splice(0, k)
        case 'tf':
            return terms.sort((termA, termB) =>
                termB.tf - termA.tf).splice(0, k)
        case 'tf-idf':
            return terms.sort((termA, termB) =>
                termB.tfidf - termA.tfidf).splice(0, k)
    }
}