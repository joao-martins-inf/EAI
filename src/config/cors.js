var whitelist = ['http://localhost:3000'];

module.exports =  function(req, callback){
    callback(null, { origin: whitelist.indexOf(req.header('Origin')) !== -1 });
}