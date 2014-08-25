var Fitbit = require('fitbit');
var key = "169f5cf6fe9c45a0ac96b92dceaf103f"
var secret = "a2177195b3ca45b1885c2129f21142eb"
module.exports = function(app,jf){
  // OAuth flow
  app.get('/', function (req, res) {
    // Create an API client and start authentication via OAuth
    var client = new Fitbit(key, secret);

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
      , client = new Fitbit(key, secret);

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

          res.redirect('/app');
        }
    );
  });

  app.get('/app', function (req, res) {
    res.send("App is working")
  });
}
