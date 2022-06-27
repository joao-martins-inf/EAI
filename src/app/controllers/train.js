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
    happy: {
        unigram: [],
        bigram: []
    },
    notHappy: {
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

        // complete object information after obtaining bag of words
        happyResults = happyResults.map(async (doc) => {
            let bagOfWordsN1 = await this.processBagOfWords(happyUniqueUnigram, doc.unigramSorted);
            let bagOfWordsN2 = await this.processBagOfWords(happyUniqueBigram, doc.bigram);

            classVector['happy'].unigram.push(bagOfWordsN1.filter(term => term.occurrences > 0));
            classVector['happy'].bigram.push(bagOfWordsN2.filter(term => term.occurrences > 0));

            return {
                ...doc,
                tfUnigramVector: bagOfWordsN1.filter(term => term.tf > 0).map(term => term.showTf()),
                tfBigramVector: bagOfWordsN2.filter(term => term.tf > 0).map(term => term.showTf()),
                occurrencesUnigramVector: bagOfWordsN1.filter(term => term.occurrences > 0).map(term => term.showOcc()),
                occurrencesBigramVector: bagOfWordsN2.filter(term => term.occurrences > 0).map(term => term.showOcc())
            }
        });

        let notHappyResults = notHappyDocs.map((doc) => {
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

        notHappyResults = notHappyResults.map(async (doc) => {
            let bagOfWordsN1 = await this.processBagOfWords(notHappyUniqueUnigram, doc.unigramSorted);
            let bagOfWordsN2 = await this.processBagOfWords(notHappyUniqueBigram, doc.bigram);

            classVector['notHappy'].unigram.push(bagOfWordsN1.filter(term => term.occurrences > 0));
            classVector['notHappy'].bigram.push(bagOfWordsN2.filter(term => term.occurrences > 0));

            return {
                ...doc,
                tfUnigramVector: bagOfWordsN1.filter(term => term.tf > 0).map(term => term.showTf()),
                tfBigramVector: bagOfWordsN2.filter(term => term.tf > 0).map(term => term.showTf()),
                occurrencesUnigramVector: bagOfWordsN1.filter(term => term.occurrences > 0).map(term => term.showOcc()),
                occurrencesBigramVector: bagOfWordsN2.filter(term => term.occurrences > 0).map(term => term.showOcc())
            }
        });

        //classVector = {happy: happyResults[0], notHappy: notHappyResults[0]}
        //return res.json(classVector);
        return res.json({});
    }

    /**
     *
     * @param happyUniqueUnigram {Term[]}
     * @param happyDocs {string[]}
     * @returns {Promise<Term[]>}
     */
    processBagOfWords = async (happyUniqueUnigram, happyDocs) => {
        happyUniqueUnigram = binaryVector(happyUniqueUnigram, happyDocs);
        happyUniqueUnigram = numberOfOccurrencesVector(happyUniqueUnigram, happyDocs);
        happyUniqueUnigram = tfVector(happyUniqueUnigram, happyDocs);
        happyUniqueUnigram = idfVector(happyUniqueUnigram, happyDocs.length, happyDocs);
        happyUniqueUnigram = tfidfVector(happyUniqueUnigram, happyDocs);
        return Promise.resolve(happyUniqueUnigram);
    }

    classVectors = async () => {
        let bestKFeatures = await getAll();
        const happy = [];
        const notHappy = [];

        bestKFeatures.map(e => {
            const term = new Term(e.name, e.binay, e.occurences, e.docId, e.tf, e.idf, e.tfidf, metric);
            if (e.label === 'happy') {
                // TODO nao temos e.ngram nem e.type
                if (e.ngram === 1) {
                    if (e.type === 'avg') {
                        happy.termsAvgMetric.push(term)
                    } else if (e.type === 'sum') {
                        happy.termsSumMetric.push(term)
                    }
                } else if (e.ngram === 2) {
                    if (e.type === 'avg') {
                        happy.bigramsTermsAvgMetric.push(term)
                    } else if (e.type === 'sum') {
                        happy.bigramsTermsSumMetric.push(term)
                    }
                }
            } else {
                if (e.ngram === 1) {
                    if (e.type === 'avg') {
                        notHappy.termsAvgMetric.push(term)
                    } else if (e.type === 'sum') {
                        notHappy.termsSumMetric.push(term)
                    }
                } else if (e.ngram === 2) {
                    if (e.type === 'avg') {
                        notHappy.bigramsTermsAvgMetric.push(term)
                    } else if (e.type === 'sum') {
                        notHappy.bigramsTermsSumMetric.push(term)
                    }
                }
            }
        })

        const result = {
            happy: {
                // TODO nao temos e.metric
                termsSumMetrics: formatByMetrics ? splitByMetrics(happyResults.termsSumMetrics) : [],
                termsAvgMetric: formatByMetrics ? splitByMetrics(happyResults.termsAvgMetrics) : [],
                bigramsTermsSumMetrics: formatByMetrics ? splitByMetrics(happyResults.bigramsTermsSumMetrics) : [],
                bigramsTermsAvgMetrics: formatByMetrics ? splitByMetrics(happyResults.bigramsTermsAvgMetrics) : []
            },
            notHappy: {
                termsSumMetrics: formatByMetrics ? splitByMetrics(happyResults.termsSumMetrics) : [],
                termsAvgMetric: formatByMetrics ? splitByMetrics(happyResults.termsAvgMetrics) : [],
                bigramsTermsSumMetrics: formatByMetrics ? splitByMetrics(happyResults.bigramsTermsSumMetrics) : [],
                bigramsTermsAvgMetrics: formatByMetrics ? splitByMetrics(happyResults.bigramsTermsAvgMetrics) : []
            }
        }

        return {
            happy: {
                bagOfWords: result.happy.termsAvgMetric.tfidf.map(e => e.name),
                idf: result.happy.termsAvgMetric.tfidf.map(e => e.idf),
                tfidf: resresult.happy.termsAvgMetric.tfidf.map(e => e.tfidf)
            },
            notHappy: {
                bagOfWords: result.notHappy.termsAvgMetric.tfidf.map(e => e.name),
                idf: result.notHappy.termsAvgMetric.tfidf.map(e => e.idf),
                tfidf: resresult.notHappy.termsAvgMetric.tfidf.map(e => e.tfidf)
            }
        }
    }
}

export const TrainController = new trainController()
