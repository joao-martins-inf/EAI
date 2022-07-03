import express from 'express';
import cleanText from './preprocessing/index.js';
import {selectKBest} from './features/featureSelection.js';
import {cosineSimilarity, classify} from './classifier/classifier.js';

const Router = express.Router;

import {CorpusController} from './app/controllers/corpus.js';
import {TrainController} from './app/controllers/train.js';
import {TestController} from './app/controllers/test.js';

const routes = new Router();

routes.get('/', (req, res) => res.json('hello world NECKLEEF!'));


routes.get('/corpus/:id', CorpusController.indexById);
routes.get('/corpus', CorpusController.index);

routes.get('/trainSet', TrainController.index);
routes.get('/train', TrainController.process);
routes.get('/preprocess', TrainController.preprocessing);

routes.post('/clean', (req, res) => {
    const {text, number} = req.body;
    const result = cleanText(text, number);
    return res.status(200).json(result);
});

routes.post('/selectkbest', (req, res) => {
    const {terms, k, metric, useSum} = req.body;
    const result = selectKBest(terms, k, metric, useSum);
    return res.json(result);
});

routes.get('/testeClassify', async (req, res)=> {
    const result = await classify('@USAirways / @AmericanAir are incompetent');
    return res.json(result);
})

routes.get('/testeCosine', async (req, res)=> {
    const result = await cosineSimilarity('@USAirways / @AmericanAir are incompetent');
    return res.json(result);
})

routes.get('/test', async (req, res) => {
    const result = await TestController.classifyTestSet();
    return res.json(result);
})



export default routes;