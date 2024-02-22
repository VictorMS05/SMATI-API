'use strict'
var bd = require('../bd/monitoreobd');
var Respuesta = require('../modelos/respuesta');
const socket = require('../sockets');
const fastCsv = require('fast-csv');
const moment = require('moment');


//GET
function obtenerXbees(req, res) {
    let respuesta = new Respuesta();

    bd.query('SELECT * FROM xbee;')
        .then(results => {
            if (results != null && results.length > 0) {
                respuesta.xbees = results;
            }
            res.status(200).send(respuesta);
        })
        .catch(error => {
            console.log(error);
            respuesta.error = true;
            respuesta.mensaje = "Ocurrió un error no controlado.";
            res.status(500).send(respuesta);
        });
}

function obtenerXbeeRegistros(req, res) {
    let respuesta = new Respuesta();
    let peticion = req.query;
    let exportar = false;

    if (req.query.exportar && (req.query.exportar == 1 || req.query.exportar == 'true')) exportar = true;

    let parametros = [
        peticion.idExbee,
        peticion.fechaDesde,
        peticion.fechaHasta,
        peticion.idXbeeRegistro
    ];

    bd.query('CALL obtenerXbeeRegistros(?, ?, ?, ?);', parametros)
        .then(results => {
            if (results != null && results.length > 0) {
                respuesta.registros = results[0];
            }
            if (!exportar) {
                res.status(200).send(respuesta);
                return;
            }

            if (respuesta.registros == null || typeof respuesta.registros == 'undefined') respuesta.registros = [];

            fastCsv.write(respuesta.registros, { headers: true })
                .transform(reg => ({
                    IdXbeeRegistro: reg.idXbeeRegistro,
                    Xbee: reg.nombre,
                    FechaRegistro: moment(reg.fecha, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
                    Nivel: reg.nivel,
                    Mensaje: reg.mensaje
                }))
                .on('end', () => { })
                .on('error', () => {
                    respuesta.error = true;
                    respuesta.mensaje = "No fue posible generar el archivo.";
                    respuesta.registros = null;
                    res.status(500).send(respuesta);
                }).pipe(res.writeHead(200, {
                    'Content-Type': 'text/csv',
                    "Content-Disposition": `attachment; filename=XbeeRegistros_${moment().format("HHmmss")}.csv`
                }));
        })
        .catch(error => {
            console.log(error);
            respuesta.error = true;
            respuesta.mensaje = "Ocurrió un error no controlado.";
            res.status(500).send(respuesta);
        });
}

//POST
function registrarXbee(req, res) {
    let respuesta = new Respuesta();
    let peticion = req.body;

    let parametros = [
        peticion.nombre,
        peticion.latitud,
        peticion.longitud
    ];

    bd.query('CALL registrarXbee(?, ?, ?, @pIdXbee);'
        + 'SELECT @pIdXbee AS idXbee;', parametros)
        .then(results => {
            if (results[1] != null && results[1].length > 0) {
                respuesta.idXbee = results[1][0].idXbee;
                respuesta.mensaje = "Registro exitoso.";
            }
            res.status(200).send(respuesta);
        })
        .catch(error => {
            console.log(error);
            respuesta.error = true;
            respuesta.mensaje = "Ocurrió un error no controlado.";
            res.status(500).send(respuesta);
        });
}

function registrarXbeeRegistro(req, res) {
    let respuesta = new Respuesta();
    let peticion = req.body;

    let parametros = [
        peticion.idXbee,
        peticion.nivel,
        peticion.mensaje
    ];
    let idXbeeRegistro = 0;
    bd.query('CALL registrarXbeeRegistro(?, ?, ?, @pError, @pMensajeOperacion, @pIdXbeeRegistro);'
        + 'SELECT @pError AS error, @pMensajeOperacion AS mensaje, @pIdXbeeRegistro AS idXbeeRegistro;', parametros)
        .then(results => {
            if (results[1] != null && results[1].length > 0) {
                respuesta.error = results[1][0].error == 1;
                respuesta.mensaje = results[1][0].mensaje;
                idXbeeRegistro = results[1][0].idXbeeRegistro;
            }
            res.status(200).send(respuesta);
        })
        .then(() => {
            if (idXbeeRegistro > 0) {
                bd.query('CALL obtenerXbeeRegistros(?, ?, ?, ?);', [null, null, null, idXbeeRegistro])
                    .then(results => {
                        if (results != null && results.length > 0) {
                            respuesta.registros = results[0]
                            socket.enviarMensaje("nuevoRegistro", results[0][0]);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        })
        .catch(error => {
            console.log(error);
            respuesta.error = true;
            respuesta.mensaje = "Ocurrió un error no controlado.";
            res.status(500).send(respuesta);
        });
}

module.exports = {
    //GET
    obtenerXbees,
    obtenerXbeeRegistros,

    //POST
    registrarXbee,
    registrarXbeeRegistro
};