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
    let db = await Mongo.getDbConnection();
    db.collection('training_set_projeto', function (err, collection) {
        collection.insertOne(record, function (err, result) {
            if (err) throw err;
        });
    });
};

/**
 *
 * @returns {Promise<Object>}
 */
Train.prototype.getTrainingSet = async function () {
    // Establish connection to db
    let db = await Mongo.getDbConnection();
    return new Promise((resolve, reject) => {
        db.collection('training_set_projeto').find({}).toArray(function (err, docs) {
            if (err) reject(err);
            else {
                resolve(docs);
            }
        });
    })

};

export const train = new Train();
//exports.Train = new Train();