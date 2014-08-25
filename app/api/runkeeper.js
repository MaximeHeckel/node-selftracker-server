var mongoose = require('mongoose');
var Sport = require('../models/sport.js');
var dateformat = require('dateformat');
var passport = require('passport');
var request = require('request');
var RunkeeperStrategy = require('passport-runkeeper').Strategy;
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

      return done(err, profile);
    });
  }
));

var isLoggedIn = function(req, res, next) {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect('/');
  }
};
