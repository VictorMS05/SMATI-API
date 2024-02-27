//! CONFIGURACIÓN DE LAS RUTAS WEB
//? Las rutas web son las direcciones URL que se utilizan para acceder a las vistas de la aplicación. En esta API se definen las rutas web para las vistas index y xbees.

'use strict' // Uso del modo estricto de JavaScript

var router = require('express').Router(); // Se llama al enrutador de la biblioteca Express

router.get('/', (req, res) => { // Se define la ruta inicial de la API para la vista index
	res.render('index'); // Se renderiza la vista index
});

router.get('/xbees', (req, res) => { // Se define la ruta inicial de la API para la vista index
	res.render('./xbees'); // Se renderiza la vista index
});

module.exports = router; // Exportar la configuración del enrutador para su uso en otros archivos