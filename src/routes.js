const routes = require('express').Router();
const { Stats } = require('./app/models');
const statsController = require('./app/controllers/stats.controller');

//Routes definition
routes.get( '/stats', statsController.getStats );
routes.get('/', (req, res) => {
  res.json({status: 'We are online'});
})
module.exports = routes;
