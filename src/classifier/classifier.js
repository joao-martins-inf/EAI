import preprocess from '../preprocessing/index.js';
import {calculateProbability, frequencyTable} from './bayes.js';
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
    let maxProbability = -Infinity
    let chosenCategory = null;
    const categories = ['positive', 'negative'];

    // clean and get unique terms
    const cleanText = preprocess(text, 1);
    const uniqueTerms = addUniqueTerms([], cleanText);
    const freqTable = frequencyTable(uniqueTerms);

    //iterate categories to find the one with max prob
    for (let i = 0; i < categories.length; i++) {
        //overall probability of this category
        const catProbability = await calculateProbability(categories[i]);
        //take the log to avoid underflow
        let logProbability = Math.log(catProbability);

        //determine P( w | c ) for each word `w` in the text
        Object.keys(freqTable).forEach(token => {
            const frequencyInText = freqTable[token];
            const tokenProb = tokenProbability(token, categories[i]);

            //determine the log of the P( w | c ) for this word
            logProbability += frequencyInText * Math.log(tokenProb)
        });
        if (logProbability > maxProbability) {
            maxProbability = logProbability
            chosenCategory = categories[i]
        }
    }



    return {chosenCategory: chosenCategory, maxProb: maxProbability};
}

const tokenProbability = (token, cat) => {
    const unigramArr = classVector[cat].unigram.map((a) => a.map((b) => b.name)).flat(1);


    //how many times this word/token has occurred in documents mapped to this category
    var wordFrequencyCount = unigramArr.reduce((a,b) =>{
        return b === token ? a+1 : a;
    })

    //what is the count of all words that have ever been mapped to this category
    var wordCount = unigramArr;

    //use laplace Add-1 Smoothing equation
    return ( wordFrequencyCount + 1 ) / ( wordCount )
}