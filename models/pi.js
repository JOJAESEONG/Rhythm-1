const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pi = new Schema({
	time: Date,
	solar: Number,
	sv: Number,
	sh: Number
});

module.exports = mongoose.model('pi', pi);
