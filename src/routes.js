const routes = require('express').Router();
const { Stats } = require('./app/models');

//Routes definition
Stats.create({
  name: 'file1',
  extension: 'json',
  lines: '1045',
  bytes: '2020' 
});

module.exports = routes;