var mongoose = require('mongoose');
var Sport = require('../models/sport.js');
var Activity = require('../models/activity.js');
var dateformat = require('dateformat');
var passport = require('passport');
var request = require('request');
var RunkeeperStrategy = require('passport-runkeeper').Strategy;
var jf = require('jsonfile');
var credentials = require('../../config/credentials.js');
var now = new Date();
var RK_URL = 'https://api.runkeeper.com/';

passport.use(new RunkeeperStrategy({
    clientID: credentials.runkeeperClientID ,
    clientSecret: credentials.runkeeperClientSecret,
    callbackURL: 'http://127.0.0.1:3000/auth/runkeeper/callback'
  },
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function (err) {
      if (!profile.access_token) {
        profile.access_token = accessToken;
      }
      var cred = {
        Token : accessToken,
        TokenSecret : refreshToken
      }
      jf.writeFile('./app/api/runkeeperToken.json',cred, function(err){
        if(err) console.log(err);
      });
      return done(err, profile);
    });
  }
));

function readToken(file, callback){
      jf.readFile(file, function(err,obj){
        if(err) callback(err);
        callback(null,obj);
      })
}

exports.storeDailyRun = function(callback){
  readToken("./app/api/runkeeperToken.json", function(err,res){

    request.get({
      uri: RK_URL + '/fitnessActivities',
      headers: {
        'Accept': 'application/vnd.com.runkeeper.FitnessActivityFeed+json',
        'Authorization': 'Bearer ' + res.Token
      }
    }, function (err, resp, body) {
      body = JSON.parse(body);
      callback(null,body.items[0])
    });
  });
}

exports.storeLastRun = function(){
  console.log("["+new Date()+"]: Storing last run");
  readToken("./app/api/runkeeperToken.json", function(err,res){
    Activity.findOne({},{}, {sort:{'date': -1}}, function(err,lastActivity){
      if(err) console.log(err);
      if(lastActivity.urilastactivity!=""){
        Sport.findOne({},{}, {sort:{'date': -1}}, function(err,lastRun){
          if(dateformat(lastRun.date,"m/dd/yy")!=dateformat(now,"m/dd/yy")){
            console.log("Creating new Run")
        request.get({
          uri: 'http://127.0.0.1:3000'+lastActivity.urilastactivity, //Need to change that ( doesn't work if we call directly the Runkeeper API ??)
          headers: {
            'Accept': 'application/vnd.com.runkeeper.FitnessActivityFeed+json',
            'Authorization': 'Bearer ' + res.Token
          }
        }, function (err, resp, body) {
              body = JSON.parse(body);
              var data = body.activity
              Sport.create({
                  climb: data.climb,
                  type: data.type,
                  distance: data.total_distance,
                  path: data.path,
                  calories: data.total_calories,
                  duration: data.duration
              },function(err,Sport){
                if(err) console.log(err)
              });
            });
          }

          else {
            console.log("No Run update needed")
          }
        });
      }
    });
  });
}
