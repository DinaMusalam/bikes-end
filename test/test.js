var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var expect = require('chai').expect;
chai.use(chaiHttp);


describe('Integration Test', function() {

  it('should return home page', function(done) {
  chai.request(server)
    .get('/')
    .end(function(err, res){
      res.should.have.status(200);
      expect(res.body).to.not.equal(null);
      done();
    });
  });

  it('should list ALL Users on /users GET', function(done) {
  chai.request(server)
    .get('/api/users')
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body[0].should.have.property('device_id');
      res.body[0].should.have.property('created_at');
      res.body.should.be.a('array');
      done();
    });
  });

  it('should list a single User info on /users/id/info GET', function(done) {
    let user = {
      user_id: "8df046af-fbdc-48c7-934b-d8cdf223651e"
    }
  chai.request(server)
    .get('/api/users/'+ user.user_id+'/info')
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.have.property('device_id');
      res.body.should.have.property('user_id');
      done();
    });
  });

  it('should list a invalid User info on /users/id/info GET', function(done) {
    let user2 = {
      user_id: "8df046af-fc7-934b-d8cdfe"
    }
  chai.request(server)
    .get('/api/users/'+ user2.user_id+'/info')
    .end(function(err, res){
      res.should.have.status(404);
      console.log("invalid user");
      done();


    });
  });

  it('should list ALL countries with their properties on /countries GET', function(done) {
  chai.request(server)
    .get('/api/countries')
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      expect(res.body).hasOwnProperty('geonameid');
      expect(res.body).hasOwnProperty('country');
      expect(res.body).hasOwnProperty('capital');
      expect(res.body).hasOwnProperty('population');
      done();
    });
  });

  it('should list global statistics on /global/statistics GET', function(done) {
  chai.request(server)
    .get('/api/global/statistics')
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.have.property('total_contributions');
      res.body.should.have.property('total_users');
      res.body.should.have.property('total_distance');
      res.body.should.have.property('total_duration');

      done();
    });
  });

  it('should list ALL cities with their properties on /cities GET', function(done) {
  chai.request(server)
    .get('/api/cities')
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      expect(res.body).hasOwnProperty('geonameid');
      expect(res.body).hasOwnProperty('latitude');
      expect(res.body).hasOwnProperty('longitude');
      expect(res.body).hasOwnProperty('country');
      expect(res.body).hasOwnProperty('population');
      done();
    });
  });

  it('should list a country statistics on /countries/id/statistics GET', function(done) {
    let country = {
      geonameid: "2661886"
    }
  chai.request(server)
    .get('/api/countries/' + country.geonameid +'/statistics')
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      expect(res.body).hasOwnProperty('total_contributions');
      expect(res.body).hasOwnProperty('total_users');
      expect(res.body).hasOwnProperty('total_distance');
      expect(res.body).hasOwnProperty('total_duration');

      done();
    });
  });

});
