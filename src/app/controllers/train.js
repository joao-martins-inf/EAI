import {train} from '../../dal/train.js';
//var train = require('../../dal/train').Train;

export const TrainController = class trainController {
    async index(req, res) {
        const {limit, label} = req.query;
        const docs = await train.getTrainingSet(label, limit);
        return res.json(docs);
    }
}