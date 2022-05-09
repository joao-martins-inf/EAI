import {tf, idf, numberOfOccurrences, tfidf} from '../preprocessing/counting.js';
import Term from '../app/class/term.js'

/**
 * For each document processed adds the new unigrams to a list
 * @param arrTerms1 {Term[]} Bag of words
 * @param arrTerms2 {string[][]} document processed
 * @param docId {number} document id
 * @returns {Term[]}
 */
export const addUniqueTerms = (arrTerms1, arrTerms2, docId) => {
    arrTerms2.forEach(wordList => {
        if (!arrTerms1.find(term => term.name === wordList.join(' ')))
            arrTerms1.push(new Term(wordList.join(' '), 0, 0, docId));
    })
    return arrTerms1;
}

/**
 * Sets binary to 1 if the terms exists in termsArr
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
 * @param bagOfWordsArr {Term[]}
 * @param termsArr {string[]}
 * @returns {Term[]}
 */
export const numberOfOccurrencesVector = (bagOfWordsArr, termsArr) => {
    bagOfWordsArr.forEach(term => {
        numberOfOccurrences(term.name, termsArr.join(''), (res) => {
            term.setOccurrences(res);
        });
    });
    return bagOfWordsArr;
}

/**
 *
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
 * @param bagOfWords {Term[]}
 * @param nDocs {number}
 * @param termsArr {string[]}
 * @returns {Term[]}
 */
export const idfVector = (bagOfWords, nDocs, termsArr) => {
    //TODO já voltamos
    bagOfWords.forEach(term => {
        term.setIdf(idf(term.occurrences, nDocs))
    });
    return bagOfWords;
}

/**
 *
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
 *
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