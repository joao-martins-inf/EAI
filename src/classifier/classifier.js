import preprocess from '../preprocessing/index.js';

/**
 *
 * @param {string} text
 * @param classVectors
 */
export const cosineSimilarity = (text, classVectors) => {
    let bagOfWords = preprocess(text, 1);

    /**
     * TODO
     * calculate tfidf from bagOfWords
     * use calculateCosineSimilarity for both classes
     */
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
    return (dotProduct) / (mV1) * (mV2)
}