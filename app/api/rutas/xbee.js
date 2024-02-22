'use strict'

var router = require('express').Router();
var xbeeRouter = require('../controlador/xbeeController');

//GET
router.get('/', xbeeRouter.obtenerXbees);
router.get('/registros', xbeeRouter.obtenerXbeeRegistros);

//POST
router.post('/', xbeeRouter.registrarXbee);
router.post('/registro', xbeeRouter.registrarXbeeRegistro);

//Exports
module.exports = router;