var Parser = require('binary-parser').Parser;
var io = require('socket.io-client');
var socket = io.connect('https://localhost:443', { rejectUnauthorized : false });

socket.on('connect', function() {
  console.log('# [Proxy] socket connected');
});

/* modified */
const pi = require('./models/pi');
const web = require('./models/web');
const lora = require('./models/lora');
function update() {
	pi.find().limit(1).sort({'_id': -1}).exec((err, data) => {
		socket.emit('pi', { 
			time: data[0].time, 
			solar: data[0].solar, 
			sv: data[0].sv,
			sh: data[0].sh
		})
	});

	web.find().limit(1).sort({'_id': -1}).exec((err, data) => {
		//console.log(data);
		socket.emit('web', { time: data[0].time, solar: data[0].solar, energy: data[0].energy });
	});

	lora.find().limit(1).sort({'_id': -1}).exec((err, data) => {
		console.log(data);
		socket.emit('lora', { time: data[0].time, solar: data[0].solar, energy: data[0].energy });
	});

	setTimeout(update, 5000);
}

update();
/* end of modified */
