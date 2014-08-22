var mongoose = require('mongoose');

module.exports = mongoose.model('Activity', {
	date: {type: Date, default: Date.now},
   steps: Number,
   activitymin: Number,
   calories: Number
});
