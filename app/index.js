//! CONFIGURACIÓN DEL ARCHIVO PRINCIPAL QUE EJECTUA LA APLICACIÓN EXPRESS
//? El archivo index.js es el archivo principal que ejecuta la aplicación Express.js. En este archivo se configura el puerto de escucha del servidor y se inicia el servicio. Además, se configura el socket para la comunicación en tiempo real con los clientes.

'use strict' //modo estricto de JavaScript

import app from './app.js'; // Se importa el módulo app.js
import { createServer } from 'http'; // Se importa la función createServer del módulo http
const server = createServer(app); // Se crea el servidor con la aplicación Express
const puerto = process.env.PORT || 8080; // Se define el puerto de escucha del servidor

//* Iniciar el servicio
server.listen(puerto, () => { //se inicia el servidor
    let host = server.address().address; //se obtiene el host del servidor
    if (host === '::') { //si el host es igual a ::
        host = 'localhost'; //se cambia el host a localhost
    }
    console.log('SMATI | API');
    console.log('-------------------------');
    console.log('Host Information\n');
    console.log('Started at https://%s:%s', host, puerto);
    console.log('-------------------------');
    console.log('API Requests\n');
});