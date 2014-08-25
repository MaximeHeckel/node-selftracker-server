var express = require('express')
  , app = express()
  , jf = require('jsonfile')
  , mongoose = require('mongoose')
  , database = require('./config/database');

var passport = require('passport');
//Configuration

mongoose.connect(database.url)
app.configure(function(){
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({secret: 'hekdhthigib'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
app.listen(3000);
})
require('./app/routes.js')(app, jf);
