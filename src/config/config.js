/**
 * Created by
 */
var config = {
    environment: "PRD",
    mongo: {
        port: 27017,
        hosts: {
            eai_labs: "mongodb+srv://eai_user:eai_pass@cluster0.bslit.mongodb.net/test",
        },
        collections: {
            corpus: "corpus",
        }
    },
};

module.exports = config;
