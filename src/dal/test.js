/**
 *
 */
 import mongo from "mongodb";

 const Server = mongo.Server;
 import config from '../config/config.js';
 import {Mongo} from './connect.js';
 
 
 var Test = function () {
 };
 
 Test.prototype.insert = async function (record) {
     // Establish connection to db
     let db = await Mongo.getDbConnection();
     db.collection('testing_set_projeto', function (err, collection) {
         collection.insertOne(record, function (err, result) {
             if (err) throw err;
         });
     });
 };
 
 /**
  *
  * @returns {Promise<Object>}
  */
  Test.prototype.getTestingSet = async function () {
     // Establish connection to db
     let db = await Mongo.getDbConnection();
     return new Promise((resolve, reject) => {
         db.collection('testing_set_projeto').find({}).toArray(function (err, docs) {
             if (err) reject(err);
             else {
                 resolve(docs);
             }
         });
     })
 
 };
 
 export const test = new Test();
 //exports.Train = new Train();