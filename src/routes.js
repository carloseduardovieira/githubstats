const routes = require('express').Router();
const { Stats } = require('./app/models');
const statsController = require('./app/controllers/stats.controller');

//Routes definition
routes.get( '/stats', statsController.getStats );

module.exports = routes;
