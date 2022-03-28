/**
 * Created by
 */
const db_eia = require('./connections/EAI_labs');

const Connection =  function(){};

Connection.prototype.getDbConnection = async function(){
    return new Promise((resolve, reject) => {
        db_eia(function(db) {
            resolve(db)
        });
    })
};


exports.Connection = new Connection();