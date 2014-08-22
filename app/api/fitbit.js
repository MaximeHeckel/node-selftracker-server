var Fitbit = require('fitbit');
var jf = require('jsonfile');

module.exports = function(){

  function readToken(file, callback){
      jf.readFile(file, function(err,obj){
        if(err) callback(err);
        callback(null,obj);
      })
  }
  
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

}
