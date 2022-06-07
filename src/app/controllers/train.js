import {train} from '../../dal/train.js';
import {insert} from '../../dal/best_k_features.js';
import preprocess from '../../preprocessing/index.js';
import fs from 'fs';
import {
    addUniqueTerms, binaryVector, tfVector, idfVector, tfidfVector, numberOfOccurrencesVector
} from '../../features/bagOfWords.js';
import {
    selectKBest
} from '../../features/featureSelection.js';

export let classVector;

/**
 *
 */
class trainController {
    async index(req, res) {
        const docs = await train.getTrainingSet();
        return res.json(docs);
    }

    async preprocessing(req, res) {
        const docs = await train.getTrainingSet();
        const corpus = docs.map((doc) => doc.corpus_details[0]);

        const happyDocs = corpus.filter((item) => {
            return item.label === 'happy'
        });

        const happyResults = happyDocs.map((doc) => {
            const n1 = preprocess(doc.description, 1);
            return {
                id: doc.id, n1: n1,
            }
        });

        return res.json(happyResults);
    }

    /**
     *
     * @param req
     * @param res
     * @returns {Promise<processed>}
     */
    process = async (req, res) => {
        const docs = await train.getTrainingSet();
        const corpus = docs.map((doc) => doc.corpus_details[0]);

        const happyDocs = corpus.filter(item => item.label === 'happy');
        const notHappyDocs = corpus.filter(item => item.label === 'not happy');

        let happyUniqueUnigram = [];
        let happyUniqueBigram = [];
        let notHappyUniqueUnigram = [];
        let notHappyUniqueBigram = [];

        let happyResults = happyDocs.map((doc) => {
            const n1 = preprocess(doc.description, 1);
            const n2 = preprocess(doc.description, 2);
            happyUniqueUnigram = addUniqueTerms(happyUniqueUnigram, n1, doc.id);
            happyUniqueBigram = addUniqueTerms(happyUniqueBigram, n2, doc.id);


            return {
                id: doc.id,
                originalText: doc.description,
                cleanText: n1.join(' '),
                unigram: n1,
                unigramSorted: [...n1].sort(),
                bigram: n2
            }
        });

        const termsN1 = happyResults.map(happydoc => happydoc.unigramSorted.map(word => word)).join(' ');
        const termsN2 = happyResults.map(happydoc => happydoc.bigram.map(word => word)).join(' ');
        //console.log(terms.split(','))
        let bagOfWordsN1 = this.processBagOfWords(happyUniqueUnigram, termsN1.split(','));
        let bagOfWordsN2 = this.processBagOfWords(happyUniqueBigram, termsN2.split(','));
        //await insert(selectKBest(bagOfWordsN1, 10, 'occurrences'));

        // complete object information after obtaining bag of words
        happyResults = happyResults.map((doc) => {
            return {
                ...doc, 
                tfUnigramVector: tfVector(bagOfWordsN1, doc.unigramSorted).map((term) => ({text: term.name, value: term.tf})),
                tfBigramVector: tfVector(bagOfWordsN2, doc.bigram).map((term) => ({text: term.name, value: term.tf})),
                occurencesUnigramVector: numberOfOccurrencesVector(bagOfWordsN1, doc.unigramSorted).map((term) => ({text: term.name, value: term.occurrences})),
                occurencesBigramVector: numberOfOccurrencesVector(bagOfWordsN2, doc.bigram).map((term) => ({text: term.name, value: term.occurrences}))
            }
        });

        console.log('asd', happyResults[0]);

        const notHappyResults = notHappyDocs.map((doc) => {
            const n1 = preprocess(doc.description, 1);
            const n2 = preprocess(doc.description, 2);
            notHappyUniqueUnigram = addUniqueTerms(notHappyUniqueUnigram, n1, doc.id);
            notHappyUniqueBigram = addUniqueTerms(notHappyUniqueBigram, n2, doc.id);

            return {
                id: doc.id,
                originalText: doc.description,
                cleanText: n1.join(' '),
                unigram: n1,
                unigramSorted: [...n1].sort(),
                bigram: n2
            }
        })

        classVector = {happy: happyResults, notHappy: notHappyResults, bagOfWordsN1: bagOfWordsN1}
        return res.json(classVector);
    }

    /**
     *
     * @param happyUniqueUnigram {Term[]}
     * @param happyDocs {string[]}
     * @returns {Term[]}
     */
    processBagOfWords = (happyUniqueUnigram, happyDocs) => {
        happyUniqueUnigram = binaryVector(happyUniqueUnigram, happyDocs);
        happyUniqueUnigram = numberOfOccurrencesVector(happyUniqueUnigram, happyDocs);
        happyUniqueUnigram = tfVector(happyUniqueUnigram, happyDocs);
        happyUniqueUnigram = idfVector(happyUniqueUnigram, happyDocs.length, happyDocs);
        //happyUniqueUnigram = tfidfVector(happyUniqueUnigram, happyDocs);
        return happyUniqueUnigram;
    }


}

export const TrainController = new trainController()
