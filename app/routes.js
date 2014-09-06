var FitbitStrategy = require('passport-fitbit').Strategy;
var RunkeeperStrategy = require('passport-runkeeper').Strategy;
var OAuth = require('oauth');
var passport = require('passport');
var request = require('request');
var schedule = require('node-schedule');
var RK_URL = 'https://api.runkeeper.com/';

var rule1 = new schedule.RecurrenceRule();
var rule2 = new schedule.RecurrenceRule();

rule1.minute = 50; //Will update 50 minutes after the next hour
rule2.minute = 55; //Will update 55 minutes after the next hour

module.exports = function(app,jf,port,auth){

  var activityController = require('../app/api/fitbit');
  var runkeeperController = require('../app/api/runkeeper');

  function readToken(file, callback){
        jf.readFile(file, function(err,obj){
          if(err) callback(err);
          callback(null,obj);
        })
  }

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });

  app.get('/', auth, function (req, res) {
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
    readToken("./app/api/runkeeperToken.json", function(err,file){
    request.get({
      uri: RK_URL + '/fitnessActivities/' + req.params.id,
      headers: {
        'Accept': 'application/vnd.com.runkeeper.FitnessActivity+json',
        'Authorization': 'Bearer ' + file.Token
      }
    }, function (err, resp, body) {
      try {
        res.json({ activity: JSON.parse(body) });
      } catch (err) {
        res.json({ activity: body.activity });
        }
      });
    });
  });

  var job1 = schedule.scheduleJob(rule1, function(){
    console.log("[ACTIVITY]: Time for an update");
    activityController.storeDailyActivity(port);
  });

  var job2 = schedule.scheduleJob(rule2, function(){
    console.log("[RUN]: Time for an update");
    runkeeperController.storeLastRun(port)
  });
};
