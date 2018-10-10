const mongoose = require('mongoose');
const web = new mongoose.Schema({
	time: Date,
	solar: Number,
	energy: Number,
});

module.exports = mongoose.model('web', web);
