var express = require('express')
  , app = express()
  , jf = require('jsonfile')
  , Fitbit = require('fitbit');

app.use(express.cookieParser());
app.use(express.session({secret: 'hekdhthigib'}));
app.listen(3000);

// OAuth flow
app.get('/', function (req, res) {
  // Create an API client and start authentication via OAuth
  var client = new Fitbit('44fde411b9fc4a79a20ad3f50c0961dd', 'a306186235724a2fb11d3c5fa82d6eed');

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
    , client = new Fitbit('44fde411b9fc4a79a20ad3f50c0961dd', 'a306186235724a2fb11d3c5fa82d6eed');

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

        var cred = {
          accessToken : token,
          accessTokenSecret : secret
        }

        jf.writeFile('./token.json',cred, function(err){
          if(err) console.log(err);
        })

        res.redirect('/working');
      }
  );
});

//Stats
function readToken(file, callback){
    jf.readFile(file, function(err,obj){
      if(err) callback(err);
      callback(null,obj);
    })
}

app.get('/working', function (req, res) {
  res.send("App is working")
});


readToken('./token.json',function(err,res){
var client = new Fitbit(
    '44fde411b9fc4a79a20ad3f50c0961dd'
  , 'a306186235724a2fb11d3c5fa82d6eed'
  , { // Now set with access tokens
         accessToken: res.accessToken
      , accessTokenSecret: res.accessTokenSecret
      , unitMeasure: 'en_GB'
    }

);
  client.getActivities(function (err, activities) {
    console.log(activities._attributes.summary);
  });
});
