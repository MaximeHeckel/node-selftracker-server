//var Fitbit = require('fitbit');
var mongoose = require('mongoose');
var Activity = require('../models/activity.js');
var dateformat = require('dateformat');
var passport = require('passport');
var request = require('request');
var FitbitStrategy = require('passport-fitbit').Strategy;
var OAuth = require('oauth');

var isLoggedIn = function(req, res, next) {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect('/');
  }
};

passport.use(new FitbitStrategy({
    consumerKey: '169f5cf6fe9c45a0ac96b92dceaf103f',
    consumerSecret: 'a2177195b3ca45b1885c2129f21142eb',
    callbackURL: "http://127.0.0.1:3000/auth/fitbit/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      if (!profile.access_token) {
        profile.access_token = accessToken;
      }
      return done(null, profile);
    });
  }
));

module.exports.getData = function(req ,res){

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

          function (err, data, res) {
            if (err) {
              console.error("Error fetching activity data. ", err);
              console.log(err);
              return;
            }

            data = JSON.parse(data);
            console.log("Fitbit Get Activities", data.summary);
  })
};

/*module.exports = function(jf){

var now = new Date();

function readToken(file, callback){
      jf.readFile(file, function(err,obj){
        if(err) callback(err);
        callback(null,obj);
      })
}

readToken('./token.json',function(err,res){
  var client = new Fitbit(
      '169f5cf6fe9c45a0ac96b92dceaf103f'
    , 'a2177195b3ca45b1885c2129f21142eb'
    , { // Now set with access tokens
           accessToken: res.accessToken
        , accessTokenSecret: res.accessTokenSecret
        , unitMeasure: 'en_GB'
      }

  );
  client.getActivities(function (err, activities) {
    //ACTIVITY UPDATE AND CREATE
    Activity.findOne({},{}, {sort:{'date': -1}}, function(err,lastActivity){
      if(err) console.log(err)
      //console.log(lastActivity)
      //console.log(dateformat(lastActivity.date,"m/dd/yy"))
      if(dateformat(lastActivity.date,"m/dd/yy")==dateformat(now,"m/dd/yy")){
        lastActivity.update({
          steps: activities._attributes.summary.steps,
          activitymin: activities._attributes.summary.fairlyActiveMinutes,
          calories: activities._attributes.summary.caloriesOut
        },function(err,Activity){
          if(err) console.log(err)
        });
      } else {
        Activity.create({
          steps: activities._attributes.summary.steps,
          activitymin: activities._attributes.summary.fairlyActiveMinutes,
          calories: activities._attributes.summary.caloriesOut
        },function(err,Activity){
            if(err) console.log(err);
          });
        }
      });
    });
  });
}*/
