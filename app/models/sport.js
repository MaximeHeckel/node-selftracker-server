var mongoose = require('mongoose');

module.exports = mongoose.model('Sport', {
  date: {type: Date, default: Date.now},
  clim: Number,
  type: String,
  distance: Number, //totaldistance
  path: Array, //gps
  calories: Number, //total calories
  duration: Number
});
