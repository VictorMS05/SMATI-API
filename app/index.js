//! CONFIGURACIÓN DEL ARCHIVO PRINCIPAL QUE EJECTUA LA APLICACIÓN NODE.JS
//? El archivo index.js es el archivo principal que ejecuta la aplicación Node.js. En este archivo se configura el puerto de escucha del servidor y se inicia el servicio. Además, se configura el socket para la comunicación en tiempo real con los clientes.

'use strict' //modo estricto de javascript

//configuracion de la aplicacion
const puerto = process.env.PORT || 8080; //puerto de escucha del servidor
const app = require('./app'); //se llama al archivo app.js
const server = require('http').Server(app); //se llama al servidor con la configuracion de la aplicacion del módulo HTTP
const io = require('socket.io')(server, { //se llama al modulo socket.io y se configura el servidor
    cors: {
        origin: true,
        credentials: true
    }
});

var nombreAplicacion = 'SMATI'; //nombre de la aplicacion

//* Configuracion del socket
var socket = require('./api/sockets'); //se llama al archivo sockets.js
socket.escucharSockets(io); //se llama a la funcion escucharSockets del archivo sockets.js

//* Iniciar el servicio
server.listen(puerto, () => { //se inicia el servidor
    nombreAplicacion = process.cwd(); //se obtiene el nombre de la aplicacion
    nombreAplicacion = nombreAplicacion.substring(nombreAplicacion.lastIndexOf('\\') + 1, nombreAplicacion.length); //se obtiene el nombre de la aplicacion

    let host = server.address().address; //se obtiene el host del servidor
    if (host === '::') { //si el host es igual a ::
        host = 'localhost'; //se cambia el host a localhost
    }

    console.log('[%s]...Iniciado en: http://%s:%s', nombreAplicacion, host, puerto); //se imprime en consola el mensaje de inicio del servidor
});