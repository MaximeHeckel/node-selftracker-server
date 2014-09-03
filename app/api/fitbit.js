var mongoose = require('mongoose');
var Activity = require('../models/activity.js');
var dateformat = require('dateformat');
var passport = require('passport');
var request = require('request');
var FitbitStrategy = require('passport-fitbit').Strategy;
var OAuth = require('oauth');
var jf = require('jsonfile');

var now = new Date();

passport.use(new FitbitStrategy({
    consumerKey: '169f5cf6fe9c45a0ac96b92dceaf103f',
    consumerSecret: 'a2177195b3ca45b1885c2129f21142eb',
    callbackURL: "http://127.0.0.1:3000/auth/fitbit/callback"
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

exports.storeData = function(){
  readToken("./app/api/fitbitToken.json",function(err,res){
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
              Activity.findOne({},{}, {sort:{'date': -1}}, function(err,lastActivity){
            if(err) console.log(err);
            if(dateformat(lastActivity.date,"m/dd/yy")==dateformat(now,"m/dd/yy")){
                  lastActivity.update({
                    steps: data.summary.steps,
                    activitymin: data.summary.fairlyActiveMinutes,
                    calories: data.summary.caloriesOut
                  },function(err,Activity){
                    if(err) console.log(err)
                  });
                } else {
                  Activity.create({
                    steps: data.summary.steps,
                    activitymin: data.summary.fairlyActiveMinutes,
                    calories: data.summary.caloriesOut
                  },function(err,Activity){
                        if(err) console.log(err);
                  });
                }
              });
              /*data = JSON.parse(data);
              console.log("Fitbit Get Activities", data.summary.steps);*/
    });
  });
};
