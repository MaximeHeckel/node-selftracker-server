var express = require('express')
  , app = express()
  , jf = require('jsonfile')
  , Fitbit = require('fitbit');

app.use(express.cookieParser());
app.use(express.session({secret: 'hekdhthigib'}));
app.listen(3000);

require('./app/routes.js')(app);

//Stats
function readToken(file, callback){
    jf.readFile(file, function(err,obj){
      if(err) callback(err);
      callback(null,obj);
    })
}

/*readToken('./token.json',function(err,res){
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
    if (err) {
      console.log(err)
      return;
    }
    console.log(activities._attributes.summary);
  });
});*/
