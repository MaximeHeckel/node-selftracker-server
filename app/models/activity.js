var mongoose = require('mongoose');

var schema = new mongoose.Schema({
		date: {type: Date, default: Date.now},
		steps: Number,
		activitymin: Number,
		calories: Number,
		distance: Number,
		rundistance: {type: Number, default: 0},
		duration: {type: Number, default: 0},
		urilastactivity: {type: String, default:""}
});

module.exports = mongoose.model('Activity', schema);
