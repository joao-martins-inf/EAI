/**
 * @module BagOfWords
 */

import {tf, idf, numberOfOccurrences, tfidf} from '../preprocessing/counting.js';
import Term from '../app/class/term.js'

/**
 * For each document processed adds the new unigrams to a list
 * @method
 * @param {Term[]} arrTerms1 Bag of words
 * @param {n} arrTerms2 document processed
 * @param {number} docId document id
 * @returns {Term[]} list of terms
 */
export const addUniqueTerms = (arrTerms1, arrTerms2, docId) => {
    arrTerms2.forEach(word => {
        if (!arrTerms1.find(term => term.name === word))
            arrTerms1.push(new Term(word, 0, 0, docId));
    })
    return arrTerms1.sort((itemA, itemB) => itemA.name > itemB.name ? 1 : -1);
}

/**
 * Sets binary to 1 if the terms exists in termsArr
 * @method
 * @param bagOfWordsArr {Term[]}
 * @param termsArr {string[]}
 * @returns {Term[]}
 */
export const binaryVector = (bagOfWordsArr, termsArr) => {
    termsArr.map((word) => {
        bagOfWordsArr.forEach(term => {
            if (term.name === word)
                term.setBinary(1);
        });
    });

    return bagOfWordsArr;
}

/**
 * Sets the numberOf occurrences in every term
 * @method
 * @param bagOfWordsArr {Term[]}
 * @param termsArr {string[]}
 * @returns {Term[]}
 */
export const numberOfOccurrencesVector = (bagOfWordsArr, termsArr) => {
    bagOfWordsArr.forEach(term => {
        term.setOccurrences(numberOfOccurrences(term.name, termsArr.join(' ')));
    });
    return bagOfWordsArr;
}

/**
 * @method
 * @param bagOfWordsArr {Term[]}
 * @param termsArr {string[]}
 * @returns {Term[]}
 */
export const tfVector = (bagOfWordsArr, termsArr) => {
    bagOfWordsArr.forEach(term => {
        term.setTf(tf(term.name, termsArr.join(' ')))
    })
    return bagOfWordsArr;
}

/**
 * @method
 * @param bagOfWords {Term[]}
 * @param nDocs {number}
 * @param termsArr {string[]}
 * @returns {Term[]}
 */
export const idfVector = (bagOfWords, nDocs, termsArr) => {
    //TODO já voltamos
    bagOfWords.forEach(term => {
        term.setIdf(idf(nDocs,term.occurrences))
    });
    return bagOfWords;
}

/**
 * @method
 * @param bagOfWordsArr {Term[]}
 * @param termsArr {string[]}
 * @returns {Term[]}
 */
export const tfidfVector = (bagOfWordsArr, termsArr) => {
    const tfVector = tfVector(bagOfWordsArr, termsArr);
    const idfVector = idfVector(bagOfWordsArr, termsArr);

    return termsArr.map((x, i) => {
        return tfidf(tfVector[i], idfVector[i])
    });
}

export const sumVector = (termsArr) => {

}

/**
 * @method
 * @param binaryVector {number[]}
 * @returns {number}
 */
export const sumBinary = (binaryVector) => {
    return binaryVector.reduce(function (prev, actual) {
        return (prev === actual && prev === 1) ? prev : 0;
    })
}

export const avgVector = (termsArr) => {

}