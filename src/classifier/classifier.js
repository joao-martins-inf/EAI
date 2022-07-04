import preprocess from '../preprocessing/index.js';
import {calculateProbability} from './bayes.js';
import {addUniqueTerms, tfVector} from '../features/bagOfWords.js'
import {classVector} from '../app/controllers/train.js';

/**
 *
 * @param {string} text
 */
export const cosineSimilarity = (text) => {
    // clean and get unique terms
    const cleanText = preprocess(text, 1);
    const uniqueTerms = addUniqueTerms([], cleanText);

    // get positive similarity
    const unigramPositiveArr = classVector.positive.unigram.map((a) => a.map((b) => b.name)).flat(1);
    const tfVectorPositive = tfVector(uniqueTerms, unigramPositiveArr);
    const tfidfPositive = getTfidf("positive", "unigram");
    const tfIdfVectorPositive = getTfIdfVector("positive", "unigram", tfVectorPositive).map(item => item.tfidf);

    const positiveSimilarity = calculateCosineSimilarity(tfidfPositive, tfIdfVectorPositive);    
    
    // get negative similarity
    const unigramNegativeArr = classVector.negative.unigram.map((a) => a.map((b) => b.name)).flat(1);
    const tfVectorNegative = tfVector(uniqueTerms, unigramNegativeArr);
    const tfidfNegative = getTfidf("negative", "unigram");
    const tfIdfVectorNegative = getTfIdfVector("negative", "unigram", tfVectorNegative).map(item => item.tfidf);

    const negativeSimilarity = calculateCosineSimilarity(tfidfNegative, tfIdfVectorNegative);    
    
    const prediction = positiveSimilarity > negativeSimilarity ? "positive" : "negative";

    return {positiveSimilarity, negativeSimilarity, prediction};
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

    // clean and get unique terms
    const cleanText = preprocess(text, 1);
    const uniqueTerms = addUniqueTerms([], cleanText);

    // get positive similarity
    const unigramPositiveArr = classVector.positive.unigram.map((a) => a.map((b) => b.name)).flat(1);
    const tfVectorPositive = tfVector(uniqueTerms, unigramPositiveArr);
    const termPositiveProbability = tfVectorPositive.map((value) => {
        return value.occurrences / tfVectorPositive.length;
    });
    const positiveProbability = await calculateProbability('positive');
    const positiveSimilarity = termPositiveProbability.reduce((a, b) => a * b) * positiveProbability;

    
    // get negative similarity
    const unigramNegativeArr = classVector.negative.unigram.map((a) => a.map((b) => b.name)).flat(1);
    const tfVectorNegative = tfVector(uniqueTerms, unigramNegativeArr);
    const termNegativeProbability = tfVectorNegative.map((value) => {
        return value.occurrences / tfVectorNegative.length;
    });
    const negativeProbability = await calculateProbability('negative');
    const negativeSimilarity = termNegativeProbability.reduce((a, b) => a * b) * negativeProbability;

    const prediction = positiveSimilarity > negativeSimilarity ? "positive" : "negative";

    return {positiveSimilarity, negativeSimilarity, prediction};    
}