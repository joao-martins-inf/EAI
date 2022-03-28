const express = require("express");

const Router = express.Router;

const CorpusController = require("./app/controllers/corpus");

const routes = new Router();


routes.get("/", (req, res) => res.json("hello world NECKLEEF!"));


routes.get("/corpus/:id", CorpusController.indexById);
routes.get("/corpus/:label", CorpusController.indexByLabel);
routes.get("/corpus", CorpusController.index);

module.exports = routes;