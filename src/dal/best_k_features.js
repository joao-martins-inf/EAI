import {Mongo} from "./connect.js";

/**
 * 
 * @param records
 * @returns {Promise<void>}
 */
export const insert = async (records) => {
    // Establish connection to db
    let db = await Mongo.getDbConnection();
    db.collection('best_k_features').insertMany(records, (err) => {
        return new Promise((resolve, reject) => {
            if(err) reject(err);
            resolve()
        })
    });
};

/**
 *
 * @returns {Promise<void>}
 */
export const getAll = async () => {
    let db = await Mongo.getDbConnection();
    db.collection('best_k_features').find({}).toArray(function (err, docs) {
        return new Promise((resolve, reject) => {
            if (err)
                reject(err);
            resolve(docs)
        })
    });
}