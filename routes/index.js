var passport = require('../lib/passport');
var db = require('../lib/mongoose');
var handler = require('../lib/route_index_eventHandler');

function route(app) {
	app.get('/', passport.checkAuthenticate, function(req, res) {
		res.render('index', { 
			content: 'maps', 
			options: JSON.stringify(db.getOptions.mapsDefaultLocation), 
			gateways: JSON.stringify(db.listGateways), 
			nodes: JSON.stringify(db.listNodes), 
			msg: req.flash('message'), 
			errmsg: req.flash('error') 
		});
	});

	app.post('/option/update', passport.checkAuthenticate, handler.updateOption, function(req, rest) {
		res.redirect('/');
	});

	app.post('/auth', 
		passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true
		})
	);

	app.use('/devices', require('./devices'));
	app.use('/sensors', require('./sensors'));
	app.use('/charts', require('./charts'));
	app.use('/comparison', require('./comparison'));

	app.get('/realtime', passport.checkAuthenticate, function(req, res) {
		res.render('realtime');
	});

	app.get('/login', function(req, res) {
		if (req.isAuthenticated()) res.redirect('/logout');
		res.render('login', { errmsg: req.flash('error') });
	});

	app.get('/logout', function(req, res) {
		if (req.isAuthenticated()) req.logout();
		res.redirect('/login');
	});
}

module.exports = route;
