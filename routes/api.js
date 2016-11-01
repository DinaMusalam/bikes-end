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
    //const query =client.query('SELECT ST_AsGeoJSON(points_geom,points_size) FROM contributions LIMIT 1');
    const query =client.query('SELECT device_id, created_at FROM users LIMIT 10');

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


/* GET countries listing. */
router.get('/countries', function(req, res, next) {
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
    //const query =client.query('SELECT ST_AsGeoJSON(points_geom,points_size) FROM contributions LIMIT 1');
    const query =client.query('SELECT geonameid, country, capital, population FROM countryinfo ');

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


/* GET country by id . */
router.get('/countries/:id', function(req, res, next) {
  const results = [];
  const id = req.param('id');
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > select users
    //const query =client.query('SELECT ST_AsGeoJSON(points_geom,points_size) FROM contributions LIMIT 1');
    const query =client.query('SELECT country, capital, population FROM countryinfo WHERE geonameid = '+id);

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

/* GET cities listing. */
router.get('/cities', function(req, res, next) {
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
    //const query =client.query('SELECT ST_AsGeoJSON(points_geom,points_size) FROM contributions LIMIT 1');
    const query =client.query('SELECT geonameid, latitude, longitude, country, population FROM geonames ');

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


/* GET city by id . */
router.get('/cities/:id', function(req, res, next) {
  const results = [];
  const id = req.param('id');
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > select users
    //const query =client.query('SELECT ST_AsGeoJSON(points_geom,points_size) FROM contributions LIMIT 1');
    const query =client.query('SELECT geonameid, latitude, longitude, country, population FROM geonames WHERE geonameid = '+id);

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


/* GET city contributions  . */
router.get('/cities/:id/contributions', function(req, res, next) {
  const results = [];
  const id = req.param('id');


  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > select users
    //const query =client.query('SELECT ST_AsGeoJSON(points_geom,points_size) FROM contributions LIMIT 1');
    const query =client.query('SELECT distance, duration, started_at FROM contributions WHERE geonameid = '+id+' LIMIT 20');

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

/* GET city statistics in time frame . */
router.get('/cities/:id/statistics/:sd/:ed', function(req, res, next) {
  const results = [];
  const id = req.param('id');
  const start_date = req.param('sd');
  const end_date = req.param('ed');

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > select users
    //const query =client.query('SELECT ST_AsGeoJSON(points_geom,points_size) FROM contributions LIMIT 1');
    const query =client.query('SELECT distance, duration, started_at FROM contributions WHERE DATE_PART(day, end - start) started_at, DATE started_at) OVERLAPS (DATE '+start_date+', DATE '+end_date+')');

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
