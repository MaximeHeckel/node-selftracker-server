var Fitbit = require('fitbit');
var Activity = require('../models/activity.js');

module.exports = function(jf){
  function readToken(file, callback){
        jf.readFile(file, function(err,obj){
          if(err) callback(err);
          callback(null,obj);
        })
  }
 var date = new Date();
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
      Activity.create({
        steps: activities._attributes.summary.steps,
        activitymin: activities._attributes.summary.fairlyActiveMinutes,
        calories: activities._attributes.summary.caloriesOut
      },function(err,Activity){
        if(err) console.log(err);
      });

      console.log(activities._attributes.summary);
    });
  });
}
