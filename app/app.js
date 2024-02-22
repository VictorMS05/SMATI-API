'use strict'
var express = require('express');
var bodyParse = require('body-parser');
var path = require('path');
const res = require('express/lib/response');

//Inicar la aplicacion
var app = express();

//Configuración de los render
app.use(bodyParse.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParse.json());

//Configuracion de cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Configuracion motor de vista o plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'web', 'views'));

//Configuracion de archivos estaticos
app.use(express.static(path.join(__dirname, 'web', 'public'), { redirect: false }));

//Configuracion de rutas web
app.use(require('./web/rutas'));

//Definición rutas de la API
app.use('/api', require('./api/rutas'))
app.use('/api/*', (req, res) => {
    res.status(200).send({
        mensaje: "La petición no es válida, pongase en contacto con el administrador."
    });
});

//Otras ruta
app.get('*', (req, res, next) => {
    res.status(200).send('<h1>¡Lo siento no encontré una respuesta para su petición!</h1>');
    // res.sendFile(path.resolve(path.join('web', 'views', 'index.html')));
});

module.exports = app;