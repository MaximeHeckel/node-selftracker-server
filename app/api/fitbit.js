var mongoose = require('mongoose');
var Activity = require('../models/activity.js');
var dateformat = require('dateformat');
var passport = require('passport');
var request = require('request');
var FitbitStrategy = require('passport-fitbit').Strategy;
var OAuth = require('oauth');
var jf = require('jsonfile');
var runkeeperController = require('./runkeeper');
var credentials = require('../../config/credentials.js');
var now = new Date();

passport.use(new FitbitStrategy({
    consumerKey: credentials.fitbitClientID,
    consumerSecret: credentials.fitbitClientSecret,
    callbackURL: credentials.host+'/auth/fitbit/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      if (!profile.access_token) {
        profile.access_token = accessToken;
      }
      var cred = {
        Token : accessToken,
        TokenSecret : refreshToken
      }
      jf.writeFile('./app/api/fitbitToken.json',cred, function(err){
        if(err) console.log(err);
      });

      return done(null, profile);
    });
  }
));

function readToken(file, callback){
      jf.readFile(file, function(err,obj){
        if(err) callback(err);
        callback(null,obj);
      })
}

exports.storeDailyActivity = function(){
  readToken("./app/api/fitbitToken.json",function(err,res){

    var oauth = new OAuth.OAuth(
      'https://api.fitbit.com/oauth/request_token',
      'https://api.fitbit.com/oauth/access_token',
      credentials.fitbitClientID,
      credentials.fitbitClientSecret,
      '1.0',
      null,
      'HMAC-SHA1'
    );

    oauth.get(
    'https://api.fitbit.com/1/user/2PQYV6/activities/date/'+dateformat(now,"yyyy-mm-dd")+'.json',
    res.Token,
    res.TokenSecret,
    function (err, data, res) {
      if (err) {
        console.error("Error fetching activity data. ", err);
        console.log(err);
        return;
      }

      data = JSON.parse(data);

      Activity.count(function(err,count){
        if(count == 0){
          Activity.create({
            steps: data.summary.steps,
            activitymin: data.summary.fairlyActiveMinutes,
            calories: data.summary.caloriesOut,
            distance: data.summary.distances[0].distance
          },function(err,Activity){
                if(err) console.log(err);
          });
        }

        else {

          Activity.findOne({},{}, {sort:{'date': -1}}, function(err,lastActivity){
            if(err) console.log(err);

            if(dateformat(lastActivity.date,"m/dd/yy")==dateformat(now,"m/dd/yy")){

              console.log("["+new Date()+"]: Updating existing entry");

              runkeeperController.storeDailyRun(function(err,res){
                if(err) console.log(err)
                var rundate = new Date(res.start_time);
                if(dateformat(now,"m/dd/yy")==dateformat(rundate,"m/dd/yy")){
                  console.log("One Run today")
                  lastActivity.update({
                    steps: data.summary.steps,
                    activitymin: data.summary.fairlyActiveMinutes,
                    calories: data.summary.caloriesOut,
                    distance: data.summary.distances[0].distance,
                    rundistance: res.total_distance,
                    duration: res.duration,
                    urilastactivity: res.uri
                  },function(err,Activity){
                      if(err) console.log(err)
                });
              }

              else{
                console.log("No Run today")
                lastActivity.update({
                  steps: data.summary.steps,
                  activitymin: data.summary.fairlyActiveMinutes,
                  calories: data.summary.caloriesOut,
                  distance: data.summary.distances[0].distance
                },function(err,Activity){
                  if(err) console.log(err)
                });
              }
              });
            }

            else {

              console.log("["+new Date()+"]: Creating new entry")

              Activity.create({
                steps: data.summary.steps,
                activitymin: data.summary.fairlyActiveMinutes,
                calories: data.summary.caloriesOut,
                distance: data.summary.distances[0].distance
              },function(err,Activity){
                    if(err) console.log(err);
              });
            }
          });
        }
      });
    });
  });
};
