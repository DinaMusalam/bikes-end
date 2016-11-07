const express = require('express');
const app= express();
const cors = require('cors');

const moment = require('moment');

const pg = require('pg');
const path = require('path');

const router = express.Router();
router.all('*', cors());



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

/* GET user info by id . */
router.get('/users/:id/info', function(req, res, next) {
  const results = [];
  const id= req.params.id;

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
    const query =client.query("SELECT users.device_id, users.user_id FROM users WHERE users.user_id = '"+id+"'");

    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results[0]);
    });
  });
});

/* GET user contributions by id . */
router.get('/users/:id/contributions', function(req, res, next) {
  const results = [];
  const id= req.params.id;

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
    const query =client.query("SELECT users.device_id, users.user_id, contributions.contribution_id,contributions.started_at FROM contributions, users WHERE users.user_id=contributions.user_id AND users.user_id = '"+id+"' ORDER BY contributions.started_at DESC");

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

/* GET  city users. */
router.get('/cities/:id/users', function(req, res, next) {
  const results = [];
  const id = req.params.id;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query >
    //const query =client.query('SELECT ST_AsGeoJSON(points_geom,points_size) FROM contributions LIMIT 1');
    const query =client.query('SELECT DISTINCT user_id FROM contributions WHERE geonameid = '+id);

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
    const query =client.query('SELECT geonameid, country, capital, population FROM countryinfo ORDER BY country ');

    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json({countries:results});
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
      return res.json({country:results});
    });
  });
});

/* GET Global statistics . */
router.get('/global/statistics', function(req, res, next) {
  const results = [];

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > select total_duration and total_distance.
    const q = 'SELECT count(*) as total_contributions, count(DISTINCT user_id) as total_users, sum(distance) as total_distance, sum(duration) as total_duration'+
        ' FROM contributions LIMIT 1  ';
    const query =client.query(q);

    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results[0]);
    });
  });
});

/* GET cities of country listing . */
router.get('/countries/:id/cities', function(req, res, next) {
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
    const query =client.query('SELECT geonames.geonameid, geonames.name, geonames.latitude, geonames.longitude , geonames.country, geonames.population, geonames.timezone FROM geonames ,countryinfo WHERE geonames.country = countryinfo.iso_alpha2 AND countryinfo.geonameid= '+id+" ORDER BY geonames.name");

    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json({cities:results});
    });
  });
});

/* GET cities listing. no use for this call */
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
      return res.json({cities:results});
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
    // SQL Query >
    //const query =client.query('SELECT ST_AsGeoJSON(points_geom,points_size) FROM contributions LIMIT 1');
    const query =client.query('SELECT geonameid, latitude, longitude, country, population, timezone FROM geonames WHERE geonameid = '+id);

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

/* GET country statistics . */
router.get('/countries/:id/statistics', function(req, res, next) {
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
    // SQL Query > select total_duration and total_distance.
    const query =client.query('SELECT count(*) as total_contributions, count(DISTINCT user_id) as total_users, sum(distance) as total_distance, sum(duration) as total_duration FROM contributions, geonames, countryinfo WHERE contributions.geonameid = geonames.geonameid AND geonames.country = countryinfo.iso_alpha2 AND countryinfo.geonameid = '+id+' LIMIT 1');

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


/* GET city statistics . */
router.get('/cities/:id/statistics', function(req, res, next) {
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
    // SQL Query > select total_duration and total_distance.
    const query =client.query('SELECT count(*) as total_contributions, count(DISTINCT user_id) as total_users, sum(distance) as total_distance, sum(duration) as total_duration,count(*) as total_contributions FROM contributions WHERE geonameid = '+id);

    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json({statistics:results[0]});
    });
  });
});

// /* GET country statistics . */
// router.get('/countries/:id/statistics', function(req, res, next) {
//   const results = [];
//   const id = req.param('id');
//
//
//   // Get a Postgres client from the connection pool
//   pg.connect(connectionString, function(err, client, done) {
//     // Handle connection errors
//     if(err) {
//       done();
//       console.log(err);
//       return res.status(500).json({success: false, data: err});
//     }
//     // SQL Query > select total_duration and total_distance.
//     const query =client.query('SELECT count(DISTINCT user_id) as total_users, sum(distance) as total_distance, sum(duration) as total_duration FROM contributions, geonames, countryinfo WHERE contributions.geonameid = geonames.geonameid AND geonames.country = countryinfo.iso_alpha2 LIMIT 1');
//
//     // Stream results back one row at a time
//     query.on('row', function(row) {
//       results.push(row);
//     });
//     // After all data is returned, close connection and return results
//     query.on('end', function() {
//       done();
//       return res.json(results);
//     });
//   });
// });

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
    const query =client.query('SELECT contribution_id, distance, duration, started_at FROM contributions WHERE geonameid = '+id+' LIMIT 20');

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

/* GET contribution by id  . */
router.get('/contributions/:id', function(req, res, next) {
  const results = [];
  const id = req.params.id;

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
    const query =client.query("SELECT * FROM contributions WHERE contribution_id = '"+id+"'");

    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      if(!results.length)
        return res.json({});
      return res.json(results[0]);
    });
  });
});

/* GET contribution Geojson . */
router.get('/contributions/:id/geojson', function(req, res, next) {
  const results = [];
  const id = req.params.id;

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
    const query =client.query("SELECT  ST_AsGeoJSON(points_geom) FROM contributions WHERE contribution_id = '"+id+"'");

    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      if(!results.length)
        return res.json({});
      return res.json(results[0]);
    });
  });
});


/* GET city contributions in time frame . */
router.get('/cities/:id/filter/:sd/:ed/:res', function(req, res, next) {
  const results = [];
  const id = req.param('id');
  const start_date = req.param('sd');
  const end_date = req.param('ed');
  const resolution = req.param('res');


  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query >
    const query =client.query("SELECT distance, duration, started_at as date FROM contributions WHERE geonameid= "+id
        +" AND started_at >= timestamp '"+start_date+"' AND started_at<= timestamp '"+end_date+"'");

    console.log('guery',query);
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


/* GET city contributions in time frame . */
router.get('/cities/:id/filter2/:sd/:ed/:res', function(req, res, next) {
  const results = [];
  const id = req.param('id');
  const start_date = req.param('sd');
  const end_date = req.param('ed');
  const resolution = req.param('res')+'s' ;//add s to work with momentjs


  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    var diff = moment(end_date).diff(start_date,resolution);
    //return res.json(diff);
    var i = 0;
    for( i =0; i<diff;i++){
      // SQL Query >
      var shiftedDate_s = moment(start_date).add(i,resolution).toISOString();
      var shiftedDate_e = moment(start_date).add(i+1,resolution).toISOString();

      var query =client.query("SELECT min(started_at) as date, sum(distance) as distance, sum(duration) as duration  FROM contributions WHERE geonameid= "+id
          +" AND started_at >= timestamp '"+shiftedDate_s+"' AND started_at <= timestamp '"+shiftedDate_e+"'");

      console.log('guery',query);
      // Stream results back one row at a time
      query.on('row', function(row) {
        if(!row.date){
          row.date =row.duration=row.distance = 0;
        }
        results.push(row);
        //console.log('results',results);

      });

      // After all data is returned, close connection and return results
      query.on('end', function() {
        if(results.length==diff){
          done();
          return res.json(results);
        }

      });
    }
    // // SQL Query >
    // const query =client.query("SELECT distance, duration, started_at as date FROM contributions WHERE geonameid= "+id
    //     +" AND started_at >= timestamp '"+start_date+"' AND started_at<= timestamp '"+end_date+"'");
    //
    // console.log('guery',query);
    // // Stream results back one row at a time
    // query.on('row', function(row) {
    //   results.push(row);
    // });

  });
});


module.exports = router;
