var FitbitStrategy = require('passport-fitbit').Strategy;
var RunkeeperStrategy = require('passport-runkeeper').Strategy;
var OAuth = require('oauth');
var passport = require('passport');
var request = require('request');
var RK_URL = 'https://api.runkeeper.com/';

module.exports = function(app,jf){

  var fitbitController = require('../app/api/fitbit');
  var runkeeperController = require('../app/api/runkeeper');

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });

  app.get('/', function (req, res) {
    res.sendfile('./views/index.html');
  });

  app.get('/auth/fitbit',passport.authenticate('fitbit'));

  app.get('/auth/runkeeper',passport.authenticate('runkeeper'));

  app.get('/auth/fitbit/callback',
    passport.authenticate('fitbit', { failureRedirect: '/' }), function (req, res) {
      req.session.authenticated = req.isAuthenticated();
      res.redirect('/');
    }
  );

  app.get('/auth/runkeeper/callback',
    passport.authenticate('runkeeper', { failureRedirect: '/' }), function (req, res) {
      req.session.authenticated = req.isAuthenticated();
      res.redirect('/');

    }
  );

/*  app.get('/status', function(req, res){
    res.send('FB RUNNING')
    var oauth = new OAuth.OAuth(
      'https://api.fitbit.com/oauth/request_token',
      'https://api.fitbit.com/oauth/access_token',
      '169f5cf6fe9c45a0ac96b92dceaf103f',
      'a2177195b3ca45b1885c2129f21142eb',
      '1.0',
      null,
      'HMAC-SHA1'
    );
    oauth.get(
      'https://api.fitbit.com/1/user/2PQYV6/activities/date/2014-08-25.json',
      req.accessToken,
      req.accessSecret,
      function (err, data, res) {
        if (err) {
          console.error("Error fetching activity data. ", err);
          console.log(err);
          return;
        }

        data = JSON.parse(data);
        console.log("Fitbit Get Activities", data.summary);
      })
  });

  app.get('/fitnessActivities', function (req, res) {
    request.get({
      uri: RK_URL + '/fitnessActivities',
      headers: {
        'Accept': 'application/vnd.com.runkeeper.FitnessActivityFeed+json',
        'Authorization': 'Bearer ' + req.session.passport.user.access_token
      }
    }, function (err, resp, body) {
      console.log(body);
      res.send("RK WORKING")
    });
  });

  app.get('/status', function(req,res){
    res.redirect('/');
  });*/
