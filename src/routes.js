//const express = require('express');
import express from 'express';
//const cleanText = require('./preprocessing');
import cleanText from './preprocessing/index.js';

const Router = express.Router;

import { CorpusController } from './app/controllers/corpus.js';
import { TrainController } from './app/controllers/train.js';

const routes = new Router();

routes.get('/', (req, res) => res.json('hello world NECKLEEF!'));


routes.get('/corpus/:id', CorpusController.indexById);
routes.get('/corpus', CorpusController.index);

routes.post('/clean', (req, res) => {
    const {text, number} = req.body;
    console.log('text', text);
    console.log('number', number);
    const result = cleanText(text, number);
    return res.json(result);
})

export default routes;