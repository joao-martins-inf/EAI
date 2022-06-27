import preprocess from '../preprocessing/index.js';
import {calculateProbability} from './bayes.js';
import {addUniqueTerms, tfVector} from '../features/bagOfWords.js'
import { classVector } from '../app/controllers/train.js';

/**
 *
 * @param {string} text
 */
export const cosineSimilarity = (text) => {
    //let bagOfWords = preprocess(text, 1);
   // const uniqueTerms = [];
    //addUniqueTerms(uniqueTerms, cleanedText, 0);

    /**
     * TODO
     * calculate tfidf from bagOfWords
     * use calculateCosineSimilarity for both classes
     */
    console.log(classVector.happy.unigram[1])

    //const happySimilarity = calculateCosineSimilarity();
    //const notHappySimilarity = calculateCosineSimilarity();

    return classVector.happy.unigram[10];
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

export const classify = (text) => {
   const cleanedText = preprocess(text, 1);
   const happyProbability = calculateProbability('happy');
   const notHappyProbability = calculateProbability('not happy');
   const uniqueTerms = [];
   addUniqueTerms(uniqueTerms, cleanedText, 0);

    const happyTfVector = tfVector()
}