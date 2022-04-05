/**
 * Created by
 */
import db_eia from './connections/EAI_labs.js';
//const db_eia = require('./connections/EAI_labs');

const Connection =  function(){};

Connection.prototype.getDbConnection = async function(){
    return new Promise((resolve, reject) => {
        db_eia(function(db) {
            resolve(db)
        });
    })
};

export const Mongo = new Connection();