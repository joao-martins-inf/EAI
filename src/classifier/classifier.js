import preprocess from '../preprocessing/index.js';
import {calculateProbability} from './bayes.js';
import {addUniqueTerms, tfVector} from '../features/bagOfWords.js'
import {classVector} from '../app/controllers/train.js';

/**
 *
 * @param {string} text
 */
export const cosineSimilarity = (text) => {
    let cleanText = preprocess(text, 1);
    let uniqueTerms = addUniqueTerms([], cleanText);

    uniqueTerms = tfVector(uniqueTerms, [...cleanText]);
    let tfidfHappy = getTfidf("happy", "unigram");
    let tfidfNotHappy = getTfidf("notHappy", "unigram");
    let tfiIdfVector = getTfIdfVector("happy", "unigram", uniqueTerms).map(item => item.tfidf);

    const happySimilarity = calculateCosineSimilarity(tfidfHappy, tfiIdfVector);
    const notHappySimilarity = calculateCosineSimilarity(tfidfNotHappy, tfiIdfVector);

    let prediction = happySimilarity > notHappySimilarity ? "happy" : "not happy";

    return {happySimilarity: happySimilarity, notHappySimilarity: notHappySimilarity, prediction: prediction};
}

const getTfIdfVector = (classType, nGram, uniqueTerms) => {
    let res = [];
    for (let i = 0; i < classVector[classType][nGram].length; i++) {
        for (let j = 0; j < classVector[classType][nGram][i].length; j++) {
            let term = classVector[classType][nGram][i][j];
            for (let k = 0; k < uniqueTerms.length; k++) {
                let termToPredict = uniqueTerms[k];
                termToPredict.setTfIdf(term.idf * termToPredict.tf)
                res.push(termToPredict);
            }
        }
    }
    return res;
}

const getTfidf = (classType, nGram) => {
    let res = [];
    for (let i = 0; i < classVector[classType][nGram].length; i++) {
        for (let j = 0; j < classVector[classType][nGram][i].length; j++) {
            let term = classVector[classType][nGram][i][j];
            res.push(term.tfidf)
        }
    }
    return res;
}

/**
 *
 * @param vector1
 * @param vector2
 */
const calculateCosineSimilarity = (vector1, vector2) => {
    let dotProduct = 0;
    let mV1 = 0;
    let mV2 = 0;
    for (let i = 0; i < vector1.length; i++) {
        dotProduct += (vector1[i] * vector2[i]);
        mV1 += (vector1[i] * vector1[i]);
        mV2 += (vector2[i] * vector2[i]);
    }
    mV1 = Math.sqrt(mV1);
    mV2 = Math.sqrt(mV2);
    return (dotProduct) / (mV1) * (mV2);
}

export const classify = async (text) => {
    let cleanText = preprocess(text, 1);
    let uniqueTerms = addUniqueTerms([], cleanText);
    const unigrams = classVector.happy.unigram.flat(1);
    const bagOfWords = addUniqueTerms(unigrams, cleanText);

    uniqueTerms = tfVector(bagOfWords, [...cleanText]);
    const happyProbability = await calculateProbability('happy');
    const notHappyProbability = await calculateProbability('not happy');
    const termProbability = uniqueTerms.map((term) => term.tf / uniqueTerms.length)

    const happySimilarity = termProbability.reduce((a, b) => a * b) * happyProbability;
    const notHappySimilarity = termProbability.reduce((a, b) => a * b) * notHappyProbability;

    let prediction = happySimilarity > notHappySimilarity ? "happy" : "not happy";

    return {happySimilarity: happySimilarity, notHappySimilarity: notHappySimilarity, prediction};
}