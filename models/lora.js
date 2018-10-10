const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lora = new Schema({
	time: Date,
	solar: Number,
	energy: Number,
	temp: Number,
	
});

module.exports = mongoose.model('lora', lora);
