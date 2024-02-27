//! CONFIGIUACIÓN DE LAS RUTAS DE LA API
//? Las rutas de la API son los puntos de acceso que permiten la comunicación entre el cliente y el servidor. En esta API se definen las rutas para los métodos GET y POST de los dispositivos Xbee y los registros de los mismos. Se utiliza un enrutador de la biblioteca Express para definir las rutas y los métodos HTTP.

'use strict' // Uso del modo estricto de JavaScript

var router = require('express').Router(); // Se llama al enrutador de la biblioteca Express
var xbeeRouter = require('../controlador/xbeeController'); // Se llama a la configuración de los métodos HTTP de la API

//* GET
router.get('/', xbeeRouter.obtenerXbees); // Se define la ruta para obtener los dispositivos Xbee y se llama al método correspondiente
router.get('/registros', xbeeRouter.obtenerXbeeRegistros); // Se define la ruta para obtener los registros de los dispositivos Xbee y se llama al método correspondiente

//* POST
router.post('/', xbeeRouter.registrarXbee); // Se define la ruta para registrar un dispositivo Xbee y se llama al método correspondiente
router.post('/registro', xbeeRouter.registrarXbeeRegistro); // Se define la ruta para registrar un registro de un dispositivo Xbee y se llama al método correspondiente

//Exports
module.exports = router; // Exportar la configuración del enrutador para su uso en otros archivos