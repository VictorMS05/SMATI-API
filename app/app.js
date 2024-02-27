'use strict' // Uso del modo estricto de JavaScript

var express = require('express'); // Se llama al módulo de la biblioteca Express
var bodyParse = require('body-parser'); // Se llama al módulo para el manejo de datos en formato JSON
var path = require('path'); // Se llama al módulo para el manejo de rutas de archivos
const res = require('express/lib/response'); // Se llama al módulo para el manejo de respuestas

//* Inicar la aplicacion
var app = express(); // Se crea una instancia de la aplicación Express

//* Configuración de los render
app.use(bodyParse.urlencoded({ limit: '5mb', extended: true })); // Se configura el manejo de datos en formato URL encoded
app.use(bodyParse.json()); // Se configura el manejo de datos en formato JSON

//* Configuracion de cabeceras HTTP
app.use((req, res, next) => { // Se configuran las cabeceras HTTP para permitir el acceso a la API desde cualquier origen
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//* Configuracion motor de vista o plantillas
app.set('view engine', 'ejs'); // Se configura el motor de plantillas para la vista index
app.set('views', path.join(__dirname, 'web', 'views')); // Se configura la ruta de las vistas

//* Configuracion de archivos estaticos
app.use(express.static(path.join(__dirname, 'web', 'public'), { redirect: false })); // Se configura la ruta de los archivos estáticos

//* Configuracion de rutas web
app.use(require('./web/rutas')); // Se llama al enrutador de la vista index

//* Definición rutas de la API
app.use('/api', require('./api/rutas')) // Se define la ruta raiz de la API para usar las rutas de la API
app.use('/api/*', (req, res) => {
    res.status(200).send({
        mensaje: "La petición no es válida, pongase en contacto con el administrador." // Se envía un mensaje de error si la petición no es válida
    });
});

//* Otras ruta
app.get('*', (req, res, next) => { // Se define la ruta inicial de la API para la vista index
    res.status(200).send('<h1>¡Lo siento no encontré una respuesta para su petición!</h1>'); // Se envía un mensaje de error si la petición no es válida
    // res.sendFile(path.resolve(path.join('web', 'views', 'index.html')));
});

module.exports = app; // Exportar la configuración de la aplicación para su uso en otros archivos