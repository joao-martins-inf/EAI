var train = require('../../dal/train').Train;

class trainController {
    async index(req, res) {
        const {limit, label} = req.query;
        const docs = await train.getTrainingSet(label, limit);
        return res.json(docs);
    }
}

module.exports = new trainController();