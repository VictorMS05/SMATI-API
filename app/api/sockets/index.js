'use strict'

var socket;

function escucharSockets(ioSocket) {
	if (ioSocket && ioSocket != null) {
		socket = ioSocket;

		ioSocket.on('connection', socketCliente => {
			socketCliente.on('disconnect', () => {
			});
		});
	}

}

function enviarMensaje(mensaje, body) {
	if (socket && socket != null) {
		socket.emit(mensaje, body);
	}
}

module.exports = {
	escucharSockets,
	enviarMensaje
};