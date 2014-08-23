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

/*var runkeeper = require('./lib/runkeeperlib.js');

var options = {
  // Client ID:
    // This value is the OAuth 2.0 client ID for your application.
    client_id : "b4a59df399584e9e82ca5314366d3c60",

    // Client Secret:
    // This value is the OAuth 2.0 shared secret for your application.
    client_secret : "d7e7cf3aa7014b2194b14ba07eb8c81f",

    // Authorization URL:
    // This is the URL to which your application should redirect the user in order to authorize access to his or her RunKeeper account.
    auth_url : "https://runkeeper.com/apps/authorize",

    // Access Token URL:
    // This is the URL at which your application can convert an authorization code to an access token.
    access_token_url : "https://runkeeper.com/apps/token",

    // Redirect URI:
    // This is the URL that RK sends user to after successful auth
    // URI naming based on Runkeeper convention
    redirect_uri : "http://localhost:3000/app"
};

var runClient = new runkeeper.HealthGraph(options);

app.get('/', function (req, res) {
  // Create an API client and start authentication via OAuth
  var runClient = new runkeeper.HealthGraph(options);

  runClient.getNewToken(authorization_code, function(access_token) {
    runClient.access_token = access_token;

    // Now you're free to do whatever you'd like with the client.

    // e.g. Get user profile information
    runClient.profile(function(data) {
      // data returned in JSON with format depending on type of call
      var obj = JSON.parse(data);
    });
  })
});
*/
