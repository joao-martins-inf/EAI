/**
 * Created by
 */
const db_eia = require('./connections/EAI_labs');

const Connection =  function(){};
let dbEIA;

Connection.prototype.openDbConnection = function(callback){
    db_eia(function (db) {
        dbEIA = db;
        callback();
    });
};

Connection.prototype.getDbConnection = function(){
    return dbEIA;
};



exports.Connection = new Connection();