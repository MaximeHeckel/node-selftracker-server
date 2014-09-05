var FitbitStrategy = require('passport-fitbit').Strategy;
var RunkeeperStrategy = require('passport-runkeeper').Strategy;
var OAuth = require('oauth');
var passport = require('passport');
var request = require('request');
var schedule = require('node-schedule');
var RK_URL = 'https://api.runkeeper.com/';

var rule = new schedule.RecurrenceRule();

rule.minute = 2;

module.exports = function(app,jf){

  var activityController = require('../app/api/fitbit');
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

 app.get('/status', function(req, res){
    res.send('FB RUNNING')
});

  app.get('/fitnessActivities', function (req, res) {
    request.get({
      uri: RK_URL + '/fitnessActivities',
      headers: {
        'Accept': 'application/vnd.com.runkeeper.FitnessActivityFeed+json',
        'Authorization': 'Bearer ' + req.session.passport.user.access_token
      }
    }, function (err, resp, body) {
      console.log(JSON.parse(body));
      res.send("RK WORKING")
    });
  });

  app.get('/fitnessActivities/:id', function (req, res) {
    request.get({
      uri: RK_URL + '/fitnessActivities/' + req.params.id,
      headers: {
        'Accept': 'application/vnd.com.runkeeper.FitnessActivity+json',
        'Authorization': 'Bearer ' + req.session.passport.user.access_token
      }
    }, function (err, resp, body) {
      try {
        res.json({ activity: JSON.parse(body) });
      } catch (err) {
        res.json({ activity: body.activity });
      }
    });
  });
  //var j = schedule.scheduleJob(rule, function(){
    console.log("Time for an update");
    activityController.storeDailyActivity();
  //});
};
