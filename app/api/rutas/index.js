//! CONFIGURACIÓN DE LA RUTA INICIAL DE LA API
//? La ruta inicial de la API es el punto de acceso principal que permite la comunicación entre el cliente y el servidor. En esta API se define la ruta inicial y se llaman a las rutas configuradas en otros archivos para que sean utilizadas desde la ruta inicial. Se utiliza un enrutador de la biblioteca Express para definir la ruta inicial y las rutas configuradas en xbbee.js.

var router = require('express').Router(); // Se llama al enrutador de la biblioteca Express

const xbee = require('./xbee'); // Se llama a la configuración de las rutas de la API

/*rutas de la api*/
router.use('/xbee', xbee); // Se define la ruta inicial de la API y se llama a las rutas configuradas en el archivo xbee.js para que sean utilizadas desde la ruta inicial

module.exports = router; // Exportar la configuración del enrutador para su uso en otros archivos