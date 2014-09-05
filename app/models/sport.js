var mongoose = require('mongoose');

module.exports = mongoose.model('Sport', {
  date: {type: Date, default: Date.now},
  climb: Number,
  type: String,
  distance: Number, //total distance
  path: Array, //gps
  calories: Number, //total calories
  duration: Number
});
