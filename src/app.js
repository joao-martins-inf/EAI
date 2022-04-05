import express from 'express';
import routes from './routes.js';
//const routes = require('./routes');
import cors from 'cors';
import corsConfig from './config/cors.js';
import bodyParser from 'body-parser';
//const corsConfig = require('./config/cors');

//const db = require('./dal');

/**
 *
 */
class App {
    constructor() {
        this.server = express();
        this.server.use(bodyParser.urlencoded({ extended: true }))
        this.middleware();

        this.routes();
    }

    middleware() {
        this.server.use(express.json());
        this.server.use(cors(corsConfig))
    }
    /**
     *
     */
    routes() {
        this.server.use(routes);
    }
}

export default new App().server;