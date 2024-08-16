'use strict'
import express from 'express';
var router = express.Router();

router.get('/', (req, res) => {
	res.render('index.html');
});

export default router;