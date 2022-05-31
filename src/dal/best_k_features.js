import {Mongo} from "./connect.js";

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