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

        let positiveResults = positiveDocs.map((doc) => {
            const n1 = preprocess(doc.text, 1);
            const n2 = preprocess(doc.text, 2);
            positiveUniqueUnigram = addUniqueTerms(positiveUniqueUnigram, n1, doc.tweet_id);
            positiveUniqueBigram = addUniqueTerms(positiveUniqueBigram, n2, doc.tweet_id);


            return {
                id: doc.tweet_id,
                originalText: doc.text,
                cleanText: n1.join(' '),
                unigram: n1,
                unigramSorted: [...n1].sort(),
                bigram: n2
            }
        });
    
        // complete object information after obtaining bag of words
        positiveResults = positiveResults.map(async (doc) => {
            let bagOfWordsN1 = await this.processBagOfWords(positiveUniqueUnigram, doc.unigramSorted);
            let bagOfWordsN2 = await this.processBagOfWords(positiveUniqueBigram, doc.bigram);
            
            classVector['positive'].unigram.push(bagOfWordsN1.filter(term => term.occurrences > 0));
            classVector['positive'].bigram.push(bagOfWordsN2.filter(term => term.occurrences > 0));

            return {
                ...doc,
                tfUnigramVector: bagOfWordsN1.filter(term => term.tf > 0).map(term => term.showTf()),
                tfBigramVector: bagOfWordsN2.filter(term => term.tf > 0).map(term => term.showTf()),
                occurrencesUnigramVector: bagOfWordsN1.filter(term => term.occurrences > 0).map(term => term.showOcc()),
                occurrencesBigramVector: bagOfWordsN2.filter(term => term.occurrences > 0).map(term => term.showOcc())
            }
        });

        let negativeResults = negativeDocs.map((doc) => {
            const n1 = preprocess(doc.text, 1);
            const n2 = preprocess(doc.text, 2);
            negativeUniqueUnigram = addUniqueTerms(negativeUniqueUnigram, n1, doc.tweet_id);
            negativeUniqueBigram = addUniqueTerms(negativeUniqueBigram, n2, doc.tweet_id);
            return {
                id: doc.tweet_id,
                originalText: doc.text,
                cleanText: n1.join(' '),
                unigram: n1,
                unigramSorted: [...n1].sort(),
                bigram: n2
            }
        })

        negativeResults = negativeResults.map(async (doc) => {
            let bagOfWordsN1 = await this.processBagOfWords(negativeUniqueUnigram, doc.unigramSorted);
            let bagOfWordsN2 = await this.processBagOfWords(negativeUniqueBigram, doc.bigram);
        
            classVector['negative'].unigram.push(bagOfWordsN1.filter(term => term.occurrences > 0));
            classVector['negative'].bigram.push(bagOfWordsN2.filter(term => term.occurrences > 0));

            return {
                ...doc,
                tfUnigramVector: bagOfWordsN1.filter(term => term.tf > 0).map(term => term.showTf()),
                tfBigramVector: bagOfWordsN2.filter(term => term.tf > 0).map(term => term.showTf()),
                occurrencesUnigramVector: bagOfWordsN1.filter(term => term.occurrences > 0).map(term => term.showOcc()),
                occurrencesBigramVector: bagOfWordsN2.filter(term => term.occurrences > 0).map(term => term.showOcc())
            }
        });

        await Promise.all(positiveResults, negativeResults);

        //classVector = {positive: happyResults[0], negative: notHappyResults[0]}
        return res.json(classVector);
        //return res.json({});
    }

    /**
     *
     * @param uniqueUnigram {Term[]}
     * @param docs {string[]}
     * @returns {Promise<Term[]>}
     */
    processBagOfWords = async (uniqueUnigram, docs) => {
        uniqueUnigram = binaryVector(uniqueUnigram, docs);
        uniqueUnigram = numberOfOccurrencesVector(uniqueUnigram, docs);
        uniqueUnigram = tfVector(uniqueUnigram, docs);
        uniqueUnigram = idfVector(uniqueUnigram, docs.length, docs);
        uniqueUnigram = tfidfVector(uniqueUnigram, docs);
        return Promise.resolve(uniqueUnigram);
    }

    classVectors = async () => {
        let bestKFeatures = await getAll();
        const positive = [];
        const negative = [];

        bestKFeatures.map(e => {
            const term = new Term(e.name, e.binay, e.occurences, e.docId, e.tf, e.tweet_idf, e.tfidf, metric);
            if (e.label === 'positive') {
                // TODO nao temos e.ngram nem e.type
                if (e.ngram === 1) {
                    if (e.type === 'avg') {
                        positive.termsAvgMetric.push(term)
                    } else if (e.type === 'sum') {
                        positive.termsSumMetric.push(term)
                    }
                } else if (e.ngram === 2) {
                    if (e.type === 'avg') {
                        positive.bigramsTermsAvgMetric.push(term)
                    } else if (e.type === 'sum') {
                        positive.bigramsTermsSumMetric.push(term)
                    }
                }
            } else {
                if (e.ngram === 1) {
                    if (e.type === 'avg') {
                        negative.termsAvgMetric.push(term)
                    } else if (e.type === 'sum') {
                        negative.termsSumMetric.push(term)
                    }
                } else if (e.ngram === 2) {
                    if (e.type === 'avg') {
                        negative.bigramsTermsAvgMetric.push(term)
                    } else if (e.type === 'sum') {
                        negative.bigramsTermsSumMetric.push(term)
                    }
                }
            }
        })

        const result = {
            positive: {
                // TODO nao temos e.metric
                termsSumMetrics: formatByMetrics ? splitByMetrics(positiveResults.termsSumMetrics) : [],
                termsAvgMetric: formatByMetrics ? splitByMetrics(positiveResults.termsAvgMetrics) : [],
                bigramsTermsSumMetrics: formatByMetrics ? splitByMetrics(positiveResults.bigramsTermsSumMetrics) : [],
                bigramsTermsAvgMetrics: formatByMetrics ? splitByMetrics(positiveResults.bigramsTermsAvgMetrics) : []
            },
            negative: {
                termsSumMetrics: formatByMetrics ? splitByMetrics(negativeResults.termsSumMetrics) : [],
                termsAvgMetric: formatByMetrics ? splitByMetrics(negativeResults.termsAvgMetrics) : [],
                bigramsTermsSumMetrics: formatByMetrics ? splitByMetrics(negativeResults.bigramsTermsSumMetrics) : [],
                bigramsTermsAvgMetrics: formatByMetrics ? splitByMetrics(negativeResults.bigramsTermsAvgMetrics) : []
            }
        }

        return {
            positive: {
                bagOfWords: result.positive.termsAvgMetric.tfidf.map(e => e.name),
                idf: result.positive.termsAvgMetric.tfidf.map(e => e.tweet_idf),
                tfidf: resresult.positive.termsAvgMetric.tfidf.map(e => e.tfidf)
            },
            negative: {
                bagOfWords: result.negative.termsAvgMetric.tfidf.map(e => e.name),
                idf: result.negative.termsAvgMetric.tfidf.map(e => e.tweet_idf),
                tfidf: resresult.negative.termsAvgMetric.tfidf.map(e => e.tfidf)
            }
        }
    }
}

export const TrainController = new trainController()
