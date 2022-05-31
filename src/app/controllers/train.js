import {train} from '../../dal/train.js';
import {insert} from '../../dal/best_k_features.js';
import preprocess from '../../preprocessing/index.js';
import fs from 'fs';
import {
    addUniqueTerms,
    binaryVector,
    tfVector,
    idfVector,
    tfidfVector,
    numberOfOccurrencesVector
} from '../../features/bagOfWords.js';
import {
    selectKBest
} from '../../features/featureSelection.js';


/**
 *
 */
class trainController {
    async index(req, res) {
        const docs = await train.getTrainingSet();
        return res.json(docs);
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

        const happyDocs = corpus.filter((item) => {
            return item.label === 'happy'
        });
        const notHappyDocs = corpus.filter((item) => {
            return item.label === 'not happy'
        });
        let happyUniqueUnigram = [];
        let happyUniqueBigram = [];
        let notHappyUniqueUnigram = [];
        let notHappyUniqueBigram = [];

        const happyResults = happyDocs.map((doc) => {
            const n1 = preprocess(doc.description, 1);
            const n2 = preprocess(doc.description, 2);
            happyUniqueUnigram = addUniqueTerms(happyUniqueUnigram, n1, doc.id);
            happyUniqueBigram = addUniqueTerms(happyUniqueBigram, n2, doc.id);


            return {
                id: doc.id,
                n1: n1,
                n2: n2
            }
        });

        const terms = happyResults.map(happydoc => happydoc.n1.map(wordList => wordList.join(' '))).join(' ');
        //console.log(terms.split(','))
        let bagOfWordsN1 = this.processBagOfWords(happyUniqueUnigram, terms.split(','));
        await insert(selectKBest(bagOfWordsN1, 10, 'occurrences'));

        const notHappyResults = notHappyDocs.map((doc) => {
            const n1 = preprocess(doc.description, 1);
            const n2 = preprocess(doc.description, 2);
            notHappyUniqueUnigram = addUniqueTerms(notHappyUniqueUnigram, n1, doc.id);
            notHappyUniqueBigram = addUniqueTerms(notHappyUniqueBigram, n2, doc.id);

            return {
                id: doc.id,
                n1,
                n2
            }
        })

        return res.json({happy: happyResults, notHappy: notHappyResults, bagOfWordsN1: bagOfWordsN1});
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