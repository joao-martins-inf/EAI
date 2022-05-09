import {tf, idf, numberOfOccurrences, tfidf } from '../preprocessing/counting.js';
import Term from '../app/class/term.js'

export const addUniqueTerms = (arrTerms1, arrTerms2, docId) => {
    arrTerms2.forEach((word) => {
        arrTerms1.find((term) => term.name === word)  
            ? null
            : arrTerms1.push(new Term(word, 1, 1, docId));
    })

    return arrTerms1;
}

export const binaryVector = (bagOfWordsArr, termsArr) => {
    return termsArr.map((word) => {
        return bagOfWordsArr.indexOf(word) !== -1 ? 1 : 0;
    })
}

export const numberOfOccurrencesVector = (bagOfWordsArr, termsArr) => {
    return termsArr.map((word) => {
        return numberOfOccurrences(word, bagOfWordsArr.join(' '))
    });
}

export const tfVector = (bagOfWordsArr, termsArr) => {
    return termsArr.map((word) => {
        return tf(word, bagOfWordsArr.join(' '));
    });
}

export const idfVector = (nDocs, termsArr) => {
    return termsArr.map((word) => {
        return idf(word, bagOfWordsArr.join(' '));
    });
}

export const tfidfVector = (bagOfWordsArr, termsArr) => {
    const tfVector = tfVector(bagOfWordsArr, termsArr);
    const idfVector = idfVector(bagOfWordsArr, termsArr);

    return termsArr.map((x, i) => {
        return tfidf(tfVector[i], idfVector[i])
    });
    
}

export const sumVector = (termsArr) => {

}

export const avgVector = (termsArr) => {

}