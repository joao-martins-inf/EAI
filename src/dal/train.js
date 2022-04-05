/**
 *
 */
 var Server = require('mongodb').Server,
 config = require('../config/config'),
 Mongo = require('./connect').Connection;


var Train = function () {
};

Train.prototype.insert = async function (record) {
 // Establish connection to db
 var db = await Mongo.getDbConnection();
 db.collection('trainingSet', function (err, collection) {
     collection.insertOne(record, function (err, result) {
         if (err) throw err;
     });
 });
};

Train.prototype.getTrainingSet = async function () {
 // Establish connection to db
 var db = await Mongo.getDbConnection();
 return new Promise((resolve, reject) => {
     db.collection('trainingSet').find({}, {}).toArray(function (err, docs) {
         if (err) reject(err);
         else {
             resolve(docs);
         }
     });
 })

};

exports.Train = new Train();