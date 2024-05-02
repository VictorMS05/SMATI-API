//! CONFIGURACIÓN DEL MANEJO DE SOCKETS PARA LA COMUNICACIÓN EN TIEMPO REAL ENTRE EL SERVIDOR Y EL CLIENTE
//? Un socket es un canal de comunicación bidireccional entre un cliente y un servidor. Se utiliza para enviar y recibir mensajes en tiempo real. La difererencia entre un socket y una petición HTTP es que el socket se mantiene abierto durante toda la comunicación, mientras que la petición HTTP se cierra una vez que se recibe la respuesta.

'use strict' // Permite usar nuevas instrucciones de ECMAScript

var socket;

//? La función escucharSockets sirve para escuchar los eventos de conexión y desconexión con los clientes
function escucharSockets(ioSocket) { // Se recibe el socket del servidor
	if (ioSocket && ioSocket != null) { // Si el socket no es nulo
		socket = ioSocket; // Se guarda el socket en una variable

		ioSocket.on('connection', socketCliente => { // Se escucha el evento de conexión con un cliente
			socketCliente.on('disconnect', () => { // Se escucha el evento de desconexión con un cliente
				// console.log('Cliente desconectado');
			});
		});
	}

}

//? La función enviarMensaje sirve para enviar mensajes a través del socket
function enviarMensaje(mensaje, body) { // Se envía un mensaje a través del socket
	if (socket && socket != null) { // Si el socket no es nulo
		socket.emit(mensaje, body); // Se emite el mensaje con el cuerpo
	}
}

module.exports = { // Se exportan los métodos escucharSockets y enviarMensaje para ser utilizados en otros archivos
	escucharSockets,
	enviarMensaje
};