const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = 'postgres://pzzkwpsqggsmig:CGOQ6vuw7ecylxEiuWJ2eIElMN@ec2-54-243-203-85.compute-1.amazonaws.com:5432/d67oe9r9t3ce0';

pg.defaults.ssl = true;

/* GET users listing. */
router.get('/users', function(req, res, next) {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
    done();
    console.log(err);
    return res.status(500).json({success: false, data: err});
  }
    // SQL Query > select users
    const query =client.query('SELECT user_id, created_at FROM users LIMIT 20');
    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
  });
    // After all data is returned, close connection and return results
    query.on('end', function() {
    done();
  return res.json(results);
  });
  });
});

module.exports = router;
