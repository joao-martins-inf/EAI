import {tf, idf} from '../preprocessing/counting';

export const addUniqueTerms = (arrTerms1, arrTerms2) => {
    arrTerms2.forEach((word) => {
        arrTerms1.indexOf(word) === -1 ? arrTerms1.push(word) : null;
    })
}

export const binaryVector = (bagOfWordsArr, termsArr) => {
    const result = [];

    termsArr.forEach((word) => {
        result.push(bagOfWordsArr.indexOf(word) !== -1 ? 1 : 0);
    })

    return result;
}

export const numberOfOccurrencesVector = (arr) => {
    return arr.reduce((prev, curr) => {
        return curr === 1 ? prev + 1 : prev;
    }, 0);
}

export const tfVector = (bagOfWordsArr, termsArr) => {
    return bagOfWordsArr.forEach((word) => {
        return tf(word, termsArr.join(' '));
    });
}

export const idfVector = (bagOfWordsArr, termsArr) => {
    return bagOfWordsArr.forEach((word) => {
        return idf(word, termsArr.join(' '));
    });
}

export const tfidfVector = (bagOfWordsArr, termsArr) => {
    return tfVector(bagOfWordsArr, termsArr) - idfVector(bagOfWordsArr, termsArr);
}