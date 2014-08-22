var express = require('express')
  , app = express()
  , jf = require('jsonfile')
  , mongoose = require('mongoose')
  , database = require('./config/database')
  , Fitbit = require('fitbit');

//Configuration

mongoose.connect(database.url)

app.use(express.cookieParser());
app.use(express.session({secret: 'hekdhthigib'}));
app.listen(3000);

require('./app/routes.js')(app, jf);
require('./app/api/fitbit.js')(jf);
