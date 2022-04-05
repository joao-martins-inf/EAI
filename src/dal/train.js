/**
 *
 */
import mongo from "mongodb";
const Server = mongo.Server;
import config from '../config/config.js';
import {Mongo} from './connect.js';


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

export const train = new Train();
//exports.Train = new Train();