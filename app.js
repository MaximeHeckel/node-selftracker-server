var express = require('express')
  , config = require('./config/app')
  , app = express()
  , Fitbit = require('fitbit');

app.use(express.cookieParser());
app.use(express.session({secret: 'hekdhthigib'}));
app.listen(3000);

// OAuth flow
app.get('/', function (req, res) {
  // Create an API client and start authentication via OAuth
  var client = new Fitbit(config.CONSUMER_KEY, config.CONSUMER_SECRET);

  client.getRequestToken(function (err, token, tokenSecret) {
    if (err) {
      // Take action
      return;
    }

    req.session.oauth = {
        requestToken: token
      , requestTokenSecret: tokenSecret
    };
    res.redirect(client.authorizeUrl(token));
  });
});

// On return from the authorization
app.get('/oauth_callback', function (req, res) {
  var verifier = req.query.oauth_verifier
    , oauthSettings = req.session.oauth
    , client = new Fitbit(config.CONSUMER_KEY, config.CONSUMER_SECRET);

  // Request an access token
  client.getAccessToken(
      oauthSettings.requestToken
    , oauthSettings.requestTokenSecret
    , verifier
    , function (err, token, secret) {
        if (err) {
          // Take action
          return;
        }

        oauthSettings.accessToken = token;
        oauthSettings.accessTokenSecret = secret;

        res.redirect('/stats');
      }
  );
});

// Display some stats
app.get('/stats', function (req, res) {
  client = new Fitbit(
      config.CONSUMER_KEY
    , config.CONSUMER_SECRET
    , { // Now set with access tokens
          accessToken: req.session.oauth.accessToken
        , accessTokenSecret: req.session.oauth.accessTokenSecret
        , unitMeasure: 'en_GB'
      }
  );

  // Fetch todays activities
  client.getActivities(function (err, activities) {
    if (err) {
      // Take action
      return;
    }

    // `activities` is a Resource model
    res.send('Total steps today: ' + activities.steps());
  });
});
