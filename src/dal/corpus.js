/**
 *
 */
import mongo from "mongodb";

const Server = mongo.Server;
import config from '../config/config.js';
import {Mongo} from './connect.js';


var Corpus = function () {
};

Corpus.prototype.insert = async function (record) {
    // Establish connection to db
    var db = await Mongo.getDbConnection();
    db.collection('corpus', function (err, collection) {
        collection.insertOne(record, function (err, result) {
            if (err) throw err;
        });
    });
};

Corpus.prototype.getDocuments = async function () {
    // Establish connection to db
    var db = await Mongo.getDbConnection();
    return new Promise((resolve, reject) => {
        db.collection('corpus_projeto').find({}).toArray(function (err, docs) {
            if (err) reject(err);
            else {
                resolve(docs);
            }
        });
    })
};

Corpus.prototype.getDocumentsByLabel = async function (label, limit) {
    var db = await Mongo.getDbConnection();
    return new Promise((resolve, reject) => {
        // Establish connection to db
        var options = {skip: 0}
        if (limit) {
            options.limit = parseInt(limit);
        }


        const filter = label ? {"airline_sentiment": label} : {};
        db.collection('corpus_projeto').find(filter, options).toArray(function (err, docs) {
            if (err) reject(err);
            else {
                resolve(docs);
            }
        });
    })

};

Corpus.prototype.getDocumentsById = async function (id) {
    // Establish connection to db
    var db = await Mongo.getDbConnection();
    return new Promise((resolve, reject) => {
        db.collection('corpus_projeto').find({"tweet_id": id}, {}).toArray(function (err, docs) {
            if (err) reject(err);
            else {
                resolve(docs);
            }
        });
    })
};


export const corpus = new Corpus();