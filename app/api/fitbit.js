//var Fitbit = require('fitbit');
var Activity = require('../models/activity.js');
var dateformat = require('dateformat');

module.exports = function(jf){

var now = new Date();

/*function readToken(file, callback){
      jf.readFile(file, function(err,obj){
        if(err) callback(err);
        callback(null,obj);
      })
}

readToken('./token.json',function(err,res){
  var client = new Fitbit(
      '169f5cf6fe9c45a0ac96b92dceaf103f'
    , 'a2177195b3ca45b1885c2129f21142eb'
    , { // Now set with access tokens
           accessToken: res.accessToken
        , accessTokenSecret: res.accessTokenSecret
        , unitMeasure: 'en_GB'
      }

  );
  client.getActivities(function (err, activities) {
    //ACTIVITY UPDATE AND CREATE
    Activity.findOne({},{}, {sort:{'date': -1}}, function(err,lastActivity){
      if(err) console.log(err)
      //console.log(lastActivity)
      //console.log(dateformat(lastActivity.date,"m/dd/yy"))
      if(dateformat(lastActivity.date,"m/dd/yy")==dateformat(now,"m/dd/yy")){
        lastActivity.update({
          steps: activities._attributes.summary.steps,
          activitymin: activities._attributes.summary.fairlyActiveMinutes,
          calories: activities._attributes.summary.caloriesOut
        },function(err,Activity){
          if(err) console.log(err)
        });
      } else {
        Activity.create({
          steps: activities._attributes.summary.steps,
          activitymin: activities._attributes.summary.fairlyActiveMinutes,
          calories: activities._attributes.summary.caloriesOut
        },function(err,Activity){
            if(err) console.log(err);
          });
        }
      });
    });
  });*/
}
