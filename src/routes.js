import express from 'express';
import cleanText from './preprocessing/index.js';
import {selectKBest} from './features/featureSelection.js';

const Router = express.Router;

import {CorpusController} from './app/controllers/corpus.js';
import {TrainController} from './app/controllers/train.js';

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
    return res.json(result);
});

routes.post('/selectkbest', (req, res) => {
    console.log(req.body);
    const {terms, k, metric, useSum} = req.body;
    const result = selectKBest(terms, k, metric, useSum);
    return res.json(result);
});

export default routes;