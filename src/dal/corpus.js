/**
 *
 */
var Server = require('mongodb').Server,
    config = require('../config/config'),
    Mongo = require('./connect').Connection;


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
        db.collection('corpus').find({}, {}).toArray(function (err, docs) {
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
            options.limit = limit;
        }
        db.collection('corpus').find({"label": label}, options).toArray(function (err, docs) {
            if (err) reject(err);
            else {
                resolve(docs);
            }
        });
    })

};

Corpus.prototype.getDocumentsById = async function (id, callback) {
    // Establish connection to db
    var db = Mongo.getDbConnection();
    return new Promise((resolve, reject) => {
        db.collection('corpus').find({"id": id}, {}).toArray(function (err, docs) {
            if (err) reject(err);
            else {
                resolve(docs);
            }
        });
    })
};

exports.Corpus = new Corpus();