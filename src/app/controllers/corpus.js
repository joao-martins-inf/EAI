var db = require('../../dal/connect').Connection;
var corpus = require('../../dal/corpus').Corpus;

class corpusController {
    async index(req, res) {
        db.openDbConnection(function () {
            corpus.getDocuments(function (docs) {
                return res.json(docs);
            })
        })
    }

    async indexByLabel(req, res) {
        const {label} = req.params;
        const {limit} = req.query;
        db.openDbConnection(function () {
            corpus.getDocumentsByLabel(label, limit, function (docs) {
                return res.json(docs);
            })
        })
    }

    async indexById(req, res) {
        const {id} = req.params;
        console.log(id);
        db.openDbConnection(function () {
            corpus.getDocumentsById(id, function (docs) {
                return res.status(200).json(docs);
            })
        })
    }
}

module.exports = new corpusController();