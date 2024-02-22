'use strict'

//configuracion de la aplicacion
const puerto = process.env.PORT || 3001;
const app = require('./app');
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: true,
        credentials: true
    }
});

var nombreAplicacion = '';

//Configuracion del socket
var socket = require('./api/sockets');
socket.escucharSockets(io);

//Iniciar el servicio
server.listen(puerto, () => {
    nombreAplicacion = process.cwd();
    nombreAplicacion = nombreAplicacion.substring(nombreAplicacion.lastIndexOf('\\') + 1, nombreAplicacion.length);

    let host = server.address().address;
    if (host === '::') {
        host = 'localhost';
    }

    console.log('[%s]...Iniciado en: http://%s:%s', nombreAplicacion, host, puerto);
});