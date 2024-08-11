//! CONFIGURACIÓN DE LA APLICACIÓN EXPRESS
//? Archivo de configuración de la aplicación Express que inicializa la aplicación, configura el manejo de datos, las cabeceras HTTP y las rutas de la página web y la API

'use strict' // Uso del modo estricto de JavaScript

import express, { static as expressStatic } from 'express'; // Se llama al módulo de la biblioteca Express
import pkg from 'body-parser'; // Se llama al módulo para el manejo de datos en formato JSON
import { join, dirname } from 'path'; // Se llama a las funciones join y dirname de la biblioteca path
import { fileURLToPath } from 'url'; // Se llama a la función fileURLToPath de la biblioteca url
import rutas_web from './web/routes/index.js'; // Se llama al módulo de las rutas de la vista index
import rutas_api from './api/routes/index.js'; // Se llama al módulo de las rutas de la API

//* <------------------- Configuración general ------------------->

let app = express(); // Se crea una instancia de la aplicación Express
const { urlencoded, json } = pkg; // Se obtienen las funciones urlencoded y json de la biblioteca body-parser
const __filename = fileURLToPath(import.meta.url); // Se obtiene la ruta del archivo actual
const __dirname = dirname(__filename); // Se obtiene el directorio del archivo actual

app.use(urlencoded({ limit: '5mb', extended: true })); // Se configura el manejo de datos en formato URL encoded
app.use(json()); // Se configura el manejo de datos en formato JSON
app.use((req, res, next) => { // Se configuran las cabeceras HTTP para permitir el acceso a la API desde cualquier origen
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//* <------------------- Configuración web ------------------->

app.set('view engine', 'ejs'); // Se configura el motor de plantillas para la vista index
app.set('views', join(__dirname, 'web', 'views')); // Se configura la ruta de las vistas
app.use(expressStatic(join(__dirname, 'web', 'public'), { redirect: false })); // Se configura la ruta de los archivos estáticos

//* <------------------- Rutas ------------------->

app.use(rutas_web); // Se define la ruta raiz ('') para usar las rutas de la página web
app.use('/api', rutas_api) // Se define la ruta raiz ('/api') para usar las rutas de la API
app.use('/api/*', (req, res) => { // Se define el manejo de errores 404 en la API
    console.log('GET ' + req.originalUrl + ' HTTPS/1.1 404 Not Found');
    res.status(404).send({
        error: true,
        mensaje: "Página no encontrada. La URL solicitada no fue encontrada en el servidor."
    });
});
app.get('*', (req, res, next) => { // Se define el manejo de errores 404 en la página web
    console.log('GET ' + req.originalUrl + ' HTTPS/1.1 404 Not Found');
    res.redirect(308, '/'); // Se redirecciona a la página principal
});

export default app; // Exportar la configuración de la aplicación para su uso en otros archivos