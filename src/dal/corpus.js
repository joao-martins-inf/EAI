/**
 *
 */
var Server = require('mongodb').Server,
    config = require('../config/config'),
    Mongo = require('./connect').Connection;


var Corpus = function () {
};

Corpus.prototype.insert = function (record) {
    // Establish connection to db
    var db = Mongo.getDbConnection();
    db.collection('corpus', function (err, collection) {
        collection.insertOne(record, function (err, result) {
            if (err) throw err;
        });
    });
};

Corpus.prototype.getDocuments = function (callback) {
    // Establish connection to db
    var db = Mongo.getDbConnection();
    db.collection('corpus').find({}, {}).toArray(function (err, docs) {
        if (err) throw err;
        else {
            callback(docs);
        }
    });
};

Corpus.prototype.getDocumentsByLabel = function (label, limit, callback) {
    // Establish connection to db
    var db = Mongo.getDbConnection();
    var options = {skip: 0}
    if(limit) {
        options.limit = limit;
    }
    db.collection('corpus').find({"label": label}, options).toArray(function (err, docs) {
        if (err) throw err;
        else {
            callback(docs);
        }
    });
};

Corpus.prototype.getDocumentsById = function (id, callback) {
    // Establish connection to db
    var db = Mongo.getDbConnection();
    db.collection('corpus').find({"id": id}, {}).toArray(function (err, docs) {
        if (err) throw err;
        else {
            callback(docs);
        }
    });
};

exports.Corpus = new Corpus();