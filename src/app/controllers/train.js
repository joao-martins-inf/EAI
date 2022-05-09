import {train} from '../../dal/train.js';
import preprocess from '../../preprocessing/index.js';
import fs from 'fs';
import {addUniqueTerms, binaryVector, tfVector, idfVector, tfidfVector, numberOfOccurrencesVector} from '../../features/bagOfWords.js';

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
     * @returns {Promise<{n1: string[], n2: string[], id: number}>}
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

        /**
        console.log("====================== Happy Results =====================");
        fs.writeFile('results.txt', "====================== Happy Results =====================", 'UTF-8', () => {
        });
        this.printInConsole(happyResults);
        this.saveInTxt(happyResults);
        fs.appendFile('results.txt', "\n", 'UTF-8', () => {
        });
        console.log("\n");

        console.log("====================== Not Happy Results =====================");
        fs.appendFile('results.txt', "====================== Not Happy Results =====================", 'UTF-8', () => {
        });
        this.saveInTxt(notHappyResults);
        this.printInConsole(notHappyResults); **/

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
        happyUniqueUnigram = idfVector(happyUniqueUnigram, happyDocs.length,happyDocs);
        //happyUniqueUnigram = tfidfVector(happyUniqueUnigram, happyDocs);
        return happyUniqueUnigram;
    }

    /**
     *
     * @param list[{n1: string[][], n2: string[][], id: number}]
     */
    printInConsole(list) {
        list.forEach((doc) => {
            console.log(`\nDocument nº: ${doc.id}`);
            console.log(`N1 - stopWords: ${doc.n1}`);
            console.log(`N1 - cleanedText: ${doc.n1}`);
            console.log(`N1 - stemmedText: ${doc.n1}`);
            console.log(`N1 - tokenization: ${doc.n1}`);
            console.log(`=====================================`);
            console.log(`N2 - stopWords: ${doc.n2}`);
            console.log(`N2 - cleanedText: ${doc.n2}`);
            console.log(`N2 - stemmedText: ${doc.n2}`);
            console.log(`N2 - tokenization: ${doc.n2}`);
            console.log("\n\n");
        });
    }

    /**
     *
     * @param list
     */
    saveInTxt(list) {
        list.forEach((doc) => {
            let text = `\nDocument nº: ${doc.id}\n
                        N1 - stopWords: ${doc.n1.stopWords}\n
                        N1 - cleanedText: ${doc.n1.cleanedText}\n
                        N1 - stemmedText: ${doc.n1.stemmedText}\n
                        N1 - tokenization: ${doc.n1.tokenization}\n
                        =====================================\n
                        N2 - stopWords: ${doc.n2.stopWords}\n
                        N2 - cleanedText: ${doc.n2.cleanedText}\n
                        N2 - stemmedText: ${doc.n2.stemmedText}\n
                        N2 - tokenization: ${doc.n2.tokenization}\n\n`;
            fs.appendFile('results.txt', text, 'utf-8', () => {
            });
        });
    }
}

export const TrainController = new trainController()