const express = require('express');
const router = express.Router();
const passport = require('../lib/passport');
const db = require('../lib/mongoose');

router.get('/', passport.checkAuthenticate, (req, res) => {
	res.render('index', {
		content: 'comparison',
		options: JSON.stringify(db.getOptions.devicesDefaultLocation),
		gateways: JSON.stringify(db.listGateways),
		nodes: JSON.stringify(db.listNodes),
		msg: req.flash('message'),
		errmsg: req.flash('error')
	});
});

module.exports = router;
