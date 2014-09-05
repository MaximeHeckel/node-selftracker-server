var mongoose = require('mongoose');
var Sport = require('../models/sport.js');
var Activity = require('../models/activity.js');
var dateformat = require('dateformat');
var passport = require('passport');
var request = require('request');
var RunkeeperStrategy = require('passport-runkeeper').Strategy;
var jf = require('jsonfile');
var RK_URL = 'https://api.runkeeper.com/';

passport.use(new RunkeeperStrategy({
    clientID: "4f4d7c07bfc6405fad65f6c922adc3ec" ,
    clientSecret: "96d66d8a34484cae96ce6efd70adfe21",
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

}
