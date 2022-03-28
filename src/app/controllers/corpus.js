var corpus = require('../../dal/corpus').Corpus;

class corpusController {
    async index(req, res) {
        const {limit, label} = req.query;
        const docs = await corpus.getDocumentsByLabel(label, limit);
        return res.json(docs);
    }

    async indexById(req, res) {
        const {id} = req.params;
        const docs = await corpus.getDocumentsById(id);
        return res.status(200).json(docs);
    }
}

module.exports = new corpusController();