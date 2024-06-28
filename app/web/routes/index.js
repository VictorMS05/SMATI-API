'use strict'
var router = require('express').Router();

router.get('/', (req, res) => {
	res.render('index');
});

router.get('/xbees', (req, res) => {
	res.render('./xbees');
});

module.exports = router;