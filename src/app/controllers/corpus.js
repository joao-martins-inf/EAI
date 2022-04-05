import {corpus} from '../../dal/corpus.js'

class corpusController {
    async index(req, res) {
        const {limit, label} = req.query;
        const docs = await corpus.getDocumentsByLabel(label.toString(), limit);
        return res.json(docs);
    }

    async indexById(req, res) {
        const {id} = req.params;
        const docs = await corpus.getDocumentsById(id);
        return res.status(200).json(docs);
    }
}

export const CorpusController = new corpusController()