import {train} from '../../dal/train.js';
import preprocess from '../../preprocessing/index.js';

class trainController {
    async index(req, res) {
        const docs = await train.getTrainingSet();
        return res.json(docs);
    }

    async process(req,res) {
        const docs = await train.getTrainingSet();
        //console.log(docs[0]);
        const corpus = docs.map((doc) => doc.corpus_details[0]);

        const happyDocs = corpus.filter((item) => { return item.label === 'happy'});
        const notHappyDocs = corpus.filter((item) => {return item.label === 'not happy'});

        const happyResults = happyDocs.map((doc) => {
            return {
                n1: preprocess(doc.description, 1),
                n2: preprocess(doc.description, 2)
            }
        });

        const notHappyResults = notHappyDocs.map((doc) => {
            return {
                n1: preprocess(doc.description, 1),
                n2: preprocess(doc.description, 2)
            }
        })


        return res.json({happy: happyResults, notHappy: notHappyResults});
    }
}

export const TrainController = new trainController()