import {train} from '../../dal/train.js';
import {insert, getAll} from '../../dal/best_k_features.js';
import preprocess from '../../preprocessing/index.js';
import fs from 'fs';
import {
    addUniqueTerms, binaryVector, tfVector, idfVector, tfidfVector, numberOfOccurrencesVector
} from '../../features/bagOfWords.js';
import {
    selectKBest
} from '../../features/featureSelection.js';
import Term from '../class/term.js';

export let classVector = {
    positive: {
        unigram: [],
        bigram: []
    },
    negative: {
        unigram: [],
        bigram: []
    }
};
;

/**
 *
 */
class trainController {
    async index(req, res) {
        const docs = await train.getTrainingSet();
        return res.json(docs);
    }

    async preprocessing(req, res) {
        const corpus = await train.getTrainingSet();

        const positiveDocs = corpus.filter((item) => {
            return item.airline_sentiment === 'negative'
        });

        const positiveResults = positiveDocs.map((doc) => {
            const n1 = preprocess(doc.text, 1);
            return {
                id: doc.tweet_id, n1: n1,
            }
        });

        return res.json(positiveResults);
    }

    /**
     *
     * @param req
     * @param res
     * @returns {Promise<processed>}
     */
    process = async (req, res) => {
        const corpus = await train.getTrainingSet();

        const positiveDocs = corpus.filter(item => item.airline_sentiment === 'positive');
        const negativeDocs = corpus.filter(item => item.airline_sentiment === 'negative');
       
        let positiveUniqueUnigram = [];
        let positiveUniqueBigram = [];
        let negativeUniqueUnigram = [];
        let negativeUniqueBigram = [];

       const positiveDocsProcessed = positiveDocs.map((doc) => {
            const n1 = preprocess(doc.text, 1);
            const n2 = preprocess(doc.text, 2);
            positiveUniqueUnigram = addUniqueTerms(positiveUniqueUnigram.map(a => {return a.clone()}), n1, doc.tweet_id);
            positiveUniqueBigram = addUniqueTerms(positiveUniqueBigram.map(a => {return a.clone()}), n2, doc.tweet_id);


            return {
                id: doc.tweet_id,
                originalText: doc.text,
                cleanText: n1.join(' '),
                unigram: n1,
                unigramSorted: [...n1].sort(),
                bigram: n2
            }
        });

        let bagOfWordsN1
        let bagOfWordsN2
        const positiveResults = [];
        const negativeResults = [];
    
        // complete object information after obtaining bag of words
        for(let doc in positiveDocsProcessed) {
            bagOfWordsN1 = await this.processBagOfWords(positiveUniqueUnigram.map(a => {return a.clone()}), positiveDocsProcessed[doc].unigramSorted);
            bagOfWordsN2 = await this.processBagOfWords(positiveUniqueBigram.map(a => {return a.clone()}), positiveDocsProcessed[doc].bigram);
            
            classVector['positive'].unigram[doc] = bagOfWordsN1.filter(term => term.occurrences > 0);
            classVector['positive'].bigram[doc] = bagOfWordsN2.filter(term => term.occurrences > 0);

            positiveResults[doc] = {
                ...positiveDocsProcessed[doc],
                tfUnigramVector: bagOfWordsN1.filter(term => term.tf > 0).map(term => term.showTf()),
                tfBigramVector: bagOfWordsN2.filter(term => term.tf > 0).map(term => term.showTf()),
                occurrencesUnigramVector: bagOfWordsN1.filter(term => term.occurrences > 0).map(term => term.showOcc()),
                occurrencesBigramVector: bagOfWordsN2.filter(term => term.occurrences > 0).map(term => term.showOcc())
            }
        }

        const negativeDocsProcessed = negativeDocs.map((doc) => {
            const n1 = preprocess(doc.text, 1);
            const n2 = preprocess(doc.text, 2);
            negativeUniqueUnigram = addUniqueTerms(negativeUniqueUnigram.map(a => {return a.clone()}), n1, doc.tweet_id);
            negativeUniqueBigram = addUniqueTerms(negativeUniqueBigram.map(a => {return a.clone()}), n2, doc.tweet_id);
            return {
                id: doc.tweet_id,
                originalText: doc.text,
                cleanText: n1.join(' '),
                unigram: n1,
                unigramSorted: [...n1].sort(),
                bigram: n2
            }
        })

        for (let doc in negativeDocsProcessed) {
            bagOfWordsN1 = await this.processBagOfWords(negativeUniqueUnigram.map(a => {return a.clone()}), negativeDocsProcessed[doc].unigramSorted);
            bagOfWordsN2 = await this.processBagOfWords(negativeUniqueBigram.map(a => {return a.clone()}), negativeDocsProcessed[doc].bigram);
        
            classVector['negative'].unigram.push(bagOfWordsN1.filter(term => term.occurrences > 0));
            classVector['negative'].bigram.push(bagOfWordsN2.filter(term => term.occurrences > 0));

            negativeDocs[doc] = {
                ...negativeDocsProcessed[doc],
                tfUnigramVector: bagOfWordsN1.filter(term => term.tf > 0).map(term => term.showTf()),
                tfBigramVector: bagOfWordsN2.filter(term => term.tf > 0).map(term => term.showTf()),
                occurrencesUnigramVector: bagOfWordsN1.filter(term => term.occurrences > 0).map(term => term.showOcc()),
                occurrencesBigramVector: bagOfWordsN2.filter(term => term.occurrences > 0).map(term => term.showOcc())
            }
        }

        //classVector = {positive: happyResults[0], negative: notHappyResults[0]}
        //return res.json(classVector);
        return res.json({});
    }

    /**
     *
     * @param uniqueUnigram {Term[]}
     * @param docs {string[]}
     * @returns {Promise<Term[]>}
     */
    processBagOfWords = async (uniqueUnigram, termsArr) => {
        uniqueUnigram = binaryVector(uniqueUnigram, termsArr);
        uniqueUnigram = numberOfOccurrencesVector(uniqueUnigram, termsArr);
        uniqueUnigram = tfVector(uniqueUnigram, termsArr);
        uniqueUnigram = idfVector(uniqueUnigram, termsArr.length, termsArr);
        uniqueUnigram = tfidfVector(uniqueUnigram, termsArr);
        return Promise.resolve(uniqueUnigram);
    }
}

export const TrainController = new trainController()
