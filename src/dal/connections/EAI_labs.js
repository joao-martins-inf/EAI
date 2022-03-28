/**
 * Created by...
 */
var MongoClient = require('mongodb').MongoClient,
    config = require('../../config/config'),
    connection;

module.exports = function (callback) {
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