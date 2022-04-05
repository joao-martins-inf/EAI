/**
 * Created by...
 */
import mongo from "mongodb";
const MongoClient = mongo.MongoClient;
import config from "../../config/config.js";

var connection;

export default function (callback) {
    //if already we have a connection, don't connect to database again
    if (connection) {
        callback(connection);
        return;
    }

    const options = {useUnifiedTopology: true};
    MongoClient.connect(config.mongo.hosts.eai_labs, options, function (err, db) {
        if (err) throw err;
        connection = db.db("EAI-Labs");
        console.log("connected to " + config.mongo.hosts.eai_labs);
        callback(connection);
    });


};