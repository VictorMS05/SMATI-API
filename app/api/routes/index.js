//! CONFIGIUACIÓN DE LAS RUTAS DE LA API
//? Las rutas de la API son los puntos de acceso que permiten la comunicación entre el cliente y el servidor. En esta API se definen las rutas para los métodos GET y POST de los dispositivos Xbee y los registros de los mismos. Se utiliza un enrutador de la biblioteca Express para definir las rutas y los métodos HTTP.

'use strict' // Uso del modo estricto de JavaScript

import express from 'express'; // Importar la biblioteca Express
const router = express.Router(); // Crear un enrutador de Express
import xbee from '../controllers/xbee.js'; // Se llama al controlador de la tabla "xbee"
import nivel from '../controllers/nivel.js';
import riesgo from '../controllers/riesgo.js';

//* <------------------ GET ------------------>

router.get('/xbee', xbee.consultar_xbee); // Se define la ruta para obtener los dispositivos Xbee y se llama al método correspondiente
router.get('/nivel/:id', nivel.consultar_nivel);
router.get('/riesgo', riesgo.consultar_riesgo);

//* <------------------ POST ------------------>

router.post('/xbee', xbee.insertar_xbee); // Se define la ruta para registrar un dispositivo Xbee y se llama al método correspondiente
router.post('/nivel', nivel.insertar_nivel);
router.post('/riesgo', riesgo.insertar_riesgo);

//* <------------------ PUT ------------------>

router.put('/riesgo/:nivel', riesgo.actualizar_riesgo); // Se define la ruta para actualizar un registro de riesgo y se llama al método correspondiente

//* <------------------ DELETE ------------------>

router.delete('/xbee/:id', xbee.eliminar_xbee); // Se define la ruta para eliminar un dispositivo Xbee y se llama al método correspondiente
router.delete('/riesgo/:nivel', riesgo.eliminar_riesgo);

export default router; // Se exporta la configuración del enrutador para su uso en otros archivos