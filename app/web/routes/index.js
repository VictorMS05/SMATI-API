'use strict'
import express from 'express';
var router = express.Router();

router.get('/', (req, res) => {
	res.render('index.ejs');
});

router.get('/xbees', (req, res) => {
	res.render('./xbees');
});

export default router;