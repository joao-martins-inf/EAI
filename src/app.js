import express from 'express';
import routes from './routes.js';
import cors from 'cors';
import corsConfig from './config/cors.js';
import bodyParser from 'body-parser';

/**
 * This class manages the express server
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