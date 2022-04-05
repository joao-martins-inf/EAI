const express = require('express');
const cleanText = require('./preprocessing');

const Router = express.Router;

const CorpusController = require('./app/controllers/corpus');
const TrainController = require('./app/controllers/train');

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

module.exports = routes;