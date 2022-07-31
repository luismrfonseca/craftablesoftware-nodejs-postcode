const R = require('ramda');
const app = require('../app');
const mysql = require('mysql');
const loggerManager = require('./logger.manager');

const pool = mysql.createPool({ ...app.config.mysql, acquireTimeout: 10000 });

pool.on('connection', function (conn) {
  conn.ping(function (err) {
    if (err) { loggerManager.getLogger().error(`API cannot connect to database: ${err.message || err}`); }

    return loggerManager.getLogger().info('API connected to the database');
  });
});

pool.on('connection', function (conn) {
  conn.on('enqueue', function (sequence) {
    if (sequence.constructor.name === 'Query') {
      loggerManager.getLogger().debug(R.trim(sequence.sql));
    }
  });
});

module.exports = pool;
