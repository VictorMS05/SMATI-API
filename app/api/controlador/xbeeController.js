//! CONFIGURACIÓN DE LOS MÉTODOS HTTP PARA LA API
//? Los métodos HTTP son un conjunto de reglas que permiten a los clientes y servidores comunicarse. Los métodos más comunes son GET, POST, PUT, DELETE, OPTIONS y PATCH. En esta API se utilizan los métodos GET y POST para obtener y enviar información, respectivamente.

'use strict' // Uso de características de ECMAScript 6
var bd = require('../bd/monitoreobd'); // Se llama a la configuración de la conexión con la base de datos
var Respuesta = require('../modelos/respuesta'); // Se llama a la configuración del JSON de respuesta
const socket = require('../sockets'); // Se llama a la configuración de los sockets
const fastCsv = require('fast-csv'); // Se llama al módulo fast-csv para la generación de archivos CSV
const moment = require('moment'); // Se llama al módulo moment para el manejo de fechas y horas

//*GET
//* Método para obtener todos los registros de la tabla xbee
function obtenerXbees(req, res) {
    let respuesta = new Respuesta(); // Se crea un nuevo JSON de respuesta a partir de la configuración de respuesta.js
    //* Consulta a la base de datos
    bd.query('SELECT * FROM xbee;')
        .then(results => { // Si la consulta es exitosa
            if (results != null && results.length > 0) { // Si hay registros
                respuesta.xbees = results; // Se crea la clave "xbees" en el JSON respuesta y se le asigna el valor de los registros obtenidos en un JSON anidado
                respuesta.mensaje = "Consulta exitosa"; // Se asigna a la clave "mensaje" un mensaje que describa la consulta exitosa en el JSON respuesta
                res.status(200).send(respuesta); // Se envía el JSON respuesta al cliente con un código 200 (OK)
            } else {
                respuesta.mensaje = "No hay xbees"; // Se asigna a la clave "mensaje" un mensaje que describa que no hay registros en el JSON respuesta
                res.status(200).send(respuesta); // Se envía el JSON respuesta al cliente con un código 200 (OK)
            }
        })
        .catch(error => { // Si la consulta no es exitosa
            console.log(error); // Se imprime el error en la consola
            respuesta.error = true; // Se cambia el valor de la clave "error" a verdadero en el JSON respuesta
            respuesta.mensaje = "Ocurrió un error no controlado"; // Se asigna a la clave "mensaje" un mensaje que describa el error en el JSON respuesta
            res.status(500).send(respuesta); // Se envía el JSON respuesta al cliente con un código 500 (Internal Server Error)
        });
}

//* Método para obtener los registros de la tabla xbeeRegistro
function obtenerXbeeRegistros(req, res) {
    let respuesta = new Respuesta(); // Se crea un nuevo JSON de respuesta a partir de la configuración de respuesta.js
    let parametros = req.query; // Se crea una variable para almacenar los parámetros de la petición (Query Parameters) en caso de que el cliente los envíe
    let exportar = false; // Se inicializa la variable exportar en falso

    if (req.query.exportar && (req.query.exportar == 1 || req.query.exportar == 'true')) exportar = true; // Si el parámetro exportar es verdadero, se cambia el valor de la variable exportar a verdadero

    //* Se crea un arreglo donde se guardan los parámetros de la petición y se crea una variable con la consulta a la base de datos cuando la base de datos maneja el procedimiento almacenado obtenerXbeeRegistros. Si el cliente envió query parameters se realizará una consulta especifica de un registro, si no se realizará una consulta general.
    // let listaParametros = [parametros.idXbee, parametros.fechaDesde, parametros.fechaHasta, parametros.idXbeeRegistro];
    // let query = 'CALL obtenerXbeeRegistros(?, ?, ?, ?);';
    //* Se crea un arreglo donde se guardan los parámetros de la petición y se crea una variable con la consulta a la base de datos cuando la base de datos no maneja el procedimiento almacenado obtenerXbeeRegistros. Si el cliente envió query parameters se realizará una consulta especifica de un registro, si no se realizará una consulta general.
    let listaParametros = [parametros.idXbee, parametros.idXbee, parametros.fechaDesde, parametros.fechaDesde, parametros.fechaHasta, parametros.fechaHasta, parametros.idXbeeRegistro, parametros.idXbeeRegistro];
    let query = 'SELECT xr.idXbeeRegistro, x.idXbee, x.nombre, xr.fecha, xr.nivel, xr.mensaje FROM xbeeRegistro AS xr INNER JOIN xbee AS x ON xr.idXbee = x.idXbee WHERE (? IS NULL OR xr.idXbee = ?) AND (? IS NULL OR xr.fecha >= ?) AND (? IS NULL OR xr.fecha <= ?) AND (? IS NULL OR xr.idXbeeRegistro = ?);';

    //* Consulta a la base de datos
    bd.query(query, listaParametros)
        .then(results => { // Si la consulta es exitosa
            if (results != null && results.length > 0) { // Si hay registros
                respuesta.registros = results; // Se crea la clave "registros" en el JSON respuesta y se le asigna el valor de los registros obtenidos en un JSON anidado
                respuesta.mensaje = "Consulta exitosa"; // Se asigna a la clave "mensaje" un mensaje que describa la consulta exitosa en el JSON respuesta
            } else { // Si no hay registros
                respuesta.mensaje = "No hay registros de xbees"; // Se asigna a la clave "mensaje" un mensaje que describa que no hay registros en el JSON respuesta
            }
            if (!exportar) { // Si la variable exportar es falsa
                res.status(200).send(respuesta); // Se envía el JSON respuesta al cliente con un código 200 (OK)
                return;
            }

            if (respuesta.registros == null || typeof respuesta.registros == 'undefined') respuesta.registros = []; // Si no hay registros, se crea un arreglo vacío en la clave "registros" del JSON respuesta

            // fastCsv.write(respuesta.registros, { headers: true }) // Se crea un archivo CSV con los registros obtenidos
            //     .transform(reg => ({
            //         IdXbeeRegistro: reg.idXbeeRegistro,
            //         Xbee: reg.nombre,
            //         FechaRegistro: moment(reg.fecha, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
            //         Nivel: reg.nivel,
            //         Mensaje: reg.mensaje
            //     }))
            //     .on('end', () => { })
            //     .on('error', () => {
            //         respuesta.error = true;
            //         respuesta.mensaje = "No fue posible generar el archivo.";
            //         respuesta.registros = null;
            //         res.status(500).send(respuesta);
            //     }).pipe(res.writeHead(200, {
            //         'Content-Type': 'text/csv',
            //         "Content-Disposition": `attachment; filename=XbeeRegistros_${moment().format("HHmmss")}.csv`
            //     }));
        })
        .catch(error => { // Si la consulta no es exitosa
            console.log(error);
            respuesta.error = true; // Se cambia el valor de la clave "error" a verdadero en el JSON respuesta
            respuesta.mensaje = "Ocurrió un error no controlado"; // Se asigna a la clave "mensaje" un mensaje que describa el error en el JSON respuesta
            res.status(500).send(respuesta); // Se envía el JSON respuesta al cliente con un código 500 (Internal Server Error)
        });
}

//* POST
//* Método para registrar un nuevo xbee en la base de datos
function registrarXbee(req, res) {
    let respuesta = new Respuesta(); // Se crea un nuevo JSON de respuesta a partir de la configuración de respuesta.js
    let peticion = req.body; // Se crea una variable para almacenar los parámetros del body que manda el cliente en la petición

    //* Consulta a la base de datos sin uso del procedimiento almacenado registrarXbee
    bd.query('SELECT idXbee FROM xbee WHERE nombre = ?;', peticion.nombre) // Se realiza una consulta para obtener el idXbee en caso de que ya exista un xbee con el mismo nombre
        .then(results => { // Si la consulta es exitosa
            if (results != null && results.length > 0) { // Si hay registros
                bd.query('UPDATE xbee SET latitud = ?, longitud = ?, fechaActualizacion = CURRENT_TIMESTAMP() WHERE idXbee = ?;', [peticion.latitud, peticion.longitud, results[0].idXbee]) // Si ya existe un xbee con el mismo nombre, se actualizan los datos de latitud y longitud
                    .then(results => { // Si la actualización es exitosa
                        if (results != null && results.affectedRows > 0) { // Si se afectó al menos un registro
                            respuesta.mensaje = "Actualización exitosa"; // Se asigna a la clave "mensaje" un mensaje que describa la actualización exitosa en el JSON respuesta
                            res.status(202).send(respuesta); // Se envía el JSON respuesta al cliente con un código 202 (Accepted)
                        } else { // Si no se afectó ningún registro
                            respuesta.error = true; // Se cambia el valor de la clave "error" a verdadero en el JSON respuesta
                            respuesta.mensaje = "No se pudo actualizar el registro"; // Se asigna a la clave "mensaje" un mensaje que describa el error en el JSON respuesta
                            res.status(400).send(respuesta); // Se envía el JSON respuesta al cliente con un código 400 (Bad Request)
                        }
                    })
                    .catch(error => { // Si la actualización no es exitosa
                        console.log(error);
                        respuesta.error = true; // Se cambia el valor de la clave "error" a verdadero en el JSON respuesta
                        respuesta.mensaje = "Ocurrió un error no controlado"; // Se asigna a la clave "mensaje" un mensaje que describa el error en el JSON respuesta
                        res.status(500).send(respuesta); // Se envía el JSON respuesta al cliente con un código 500 (Internal Server Error)
                    });
            } else { // Si no hay registros
                bd.query('INSERT INTO xbee(nombre, latitud, longitud, fechaRegistro, fechaActualizacion) VALUES(?, ?, ?, CURRENT_TIMESTAMP(), NULL);', [peticion.nombre, peticion.latitud, peticion.longitud]) // Si no existe un xbee con el mismo nombre, se inserta un nuevo registro
                    .then(results => { // Si la inserción es exitosa
                        if (results != null && results.affectedRows > 0) { // Si se afectó al menos un registro
                            respuesta.mensaje = "Registro exitoso"; // Se asigna a la clave "mensaje" un mensaje que describa la inserción exitosa en el JSON respuesta
                            res.status(201).send(respuesta); // Se envía el JSON respuesta al cliente con un código 201 (Created)
                        } else {
                            respuesta.error = true; // Se cambia el valor de la clave "error" a verdadero en el JSON respuesta
                            respuesta.mensaje = "No se pudo registrar el nuevo xbee"; // Se asigna a la clave "mensaje" un mensaje que describa el error en el JSON respuesta
                            res.status(400).send(respuesta); // Se envía el JSON respuesta al cliente con un código 400 (Bad Request)
                        }
                    })
                    .catch(error => { // Si la inserción no es exitosa
                        console.log(error);
                        respuesta.error = true; // Se cambia el valor de la clave "error" a verdadero en el JSON respuesta
                        respuesta.mensaje = "Ocurrió un error no controlado"; // Se asigna a la clave "mensaje" un mensaje que describa el error en el JSON respuesta
                        res.status(500).send(respuesta); // Se envía el JSON respuesta al cliente con un código 500 (Internal Server Error)
                    });
            }
        })
        .catch(error => { // Si la consulta no es exitosa
            console.log(error);
            respuesta.error = true; // Se cambia el valor de la clave "error" a verdadero en el JSON respuesta
            respuesta.mensaje = "Ocurrió un error no controlado"; // Se asigna a la clave "mensaje" un mensaje que describa el error en el JSON respuesta
            res.status(500).send(respuesta); // Se envía el JSON respuesta al cliente con un código 500 (Internal Server Error)
        });

    //* Consulta a la base de datos con uso del procedimiento almacenado registrarXbee
    // bd.query('CALL registrarXbee(?, ?, ?, @pIdXbee);'
    //     + 'SELECT @pIdXbee AS idXbee;', [peticion.nombre, peticion.latitud, peticion.longitud]) // Se realiza una consulta para registrar un nuevo xbee
    //     .then(results => { // Si la consulta es exitosa
    //         if (results[1] != null && results[1].length > 0) { // Si hay registros
    //             respuesta.idXbee = results[1][0].idXbee; // Se crea la clave "idXbee" en el JSON respuesta y se le asigna el valor del idXbee obtenido
    //             respuesta.mensaje = "Registro exitoso."; // Se asigna a la clave "mensaje" un mensaje que describa la inserción exitosa en el JSON respuesta
    //         }
    //         res.status(200).send(respuesta); // Se envía el JSON respuesta al cliente con un código 200 (OK)
    //     })
    //     .catch(error => { // Si la consulta no es exitosa
    //         console.log(error);
    //         respuesta.error = true; // Se cambia el valor de la clave "error" a verdadero en el JSON respuesta
    //         respuesta.mensaje = "Ocurrió un error no controlado."; // Se asigna a la clave "mensaje" un mensaje que describa el error en el JSON respuesta
    //         res.status(500).send(respuesta); // Se envía el JSON respuesta al cliente con un código 500 (Internal Server Error)
    //     });
}

//* Método para registrar un nuevo registro de información de un xbee en la base de datos
function registrarXbeeRegistro(req, res) {
    let respuesta = new Respuesta(); // Se crea un nuevo JSON de respuesta a partir de la configuración de respuesta.js
    let peticion = req.body; // Se crea una variable para almacenar los parámetros del body que manda el cliente en la petición
    // let idXbeeRegistro = 0;

    //* Consulta a la base de datos sin uso del procedimiento almacenado registrarXbeeRegistro
    if (peticion.idXbee == 0 || peticion.idXbee == null || peticion.idXbee == undefined) { // Si el idXbee es nulo, cero o indefinido
        respuesta.error = true; // Se cambia el valor de la clave "error" a verdadero en el JSON respuesta
        respuesta.mensaje = "El idXbee es requerido"; // Se asigna a la clave "mensaje" un mensaje que describa el error en el JSON respuesta
        res.status(400).send(respuesta); // Se envía el JSON respuesta al cliente con un código 400 (Bad Request)
        return; // Se termina la ejecución del método
    } else { // Si el idXbee no es nulo, cero o indefinido
        bd.query('SELECT idXbee FROM xbeeRegistro WHERE idXbee = ?;', peticion.idXbee) // Se realiza una consulta para obtener el idXbee en caso de que exista un xbee con el mismo idXbee
            .then(results => { // Si la consulta es exitosa
                if (results != null && results.length > 0) { // Si hay registros
                    bd.query('SELECT * FROM xbeeRegistro WHERE idXbee = ?;', results[0].idXbee) //historialRegistros<-Tabla
                        .then(results => {
                            if (results != null && results.length > 0) {
                                bd.query('INSERT INTO historialRegistro(idXbee, fecha, nivel, mensaje) VALUES(?, CURRENT_TIMESTAMP(), ?, ?);', [results[0].idXbee, results[0].nivel, results[0].mensaje])
                                    .then(results => {
                                        if (results != null && results.affectedRows > 0) {
                                            console.log("Migración del registro al historial exitosa");
                                        } else {
                                            console.log("No se pudo migrar el nuevo registro");
                                        }
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        console.log("Ocurrió un error no controlado por culpa de Fer");
                                    });
                            } else {
                                console.log("No se encontraron datos en xbeeRegistros");
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            console.log("Ocurrió un error no controlado en la obtención de datos de la tabla xbeeRegistros");
                        });
                    bd.query('UPDATE xbeeRegistro SET fecha = CURRENT_TIMESTAMP(), nivel = ?, mensaje = ? WHERE idXbee = ?;', [peticion.nivel, peticion.mensaje, results[0].idXbee]) // Si ya existe un registro con el mismo idXbee, se actualizan los datos de fecha, nivel y mensaje
                        .then(results => { // Si la actualización es exitosa
                            if (results != null && results.affectedRows > 0) { // Si se afectó al menos un registro
                                respuesta.mensaje = "Actualización exitosa"; // Se asigna a la clave "mensaje" un mensaje que describa la actualización exitosa en el JSON respuesta
                                res.status(202).send(respuesta); // Se envía el JSON respuesta al cliente con un código 202 (Accepted)
                            } else { // Si no se afectó ningún registro
                                respuesta.error = true; // Se cambia el valor de la clave "error" a verdadero en el JSON respuesta
                                respuesta.mensaje = "No se pudo actualizar el registro"; // Se asigna a la clave "mensaje" un mensaje que describa el error en el JSON respuesta
                                res.status(400).send(respuesta); // Se envía el JSON respuesta al cliente con un código 400 (Bad Request)
                            }
                        })
                        .catch(error => { // Si la actualización no es exitosa
                            console.log(error);
                            respuesta.error = true; // Se cambia el valor de la clave "error" a verdadero en el JSON respuesta
                            respuesta.mensaje = "Ocurrió un error no controlado"; // Se asigna a la clave "mensaje" un mensaje que describa el error en el JSON respuesta
                            res.status(500).send(respuesta); // Se envía el JSON respuesta al cliente con un código 500 (Internal Server Error)
                        });
                } else { // Si no hay registros
                    bd.query('INSERT INTO xbeeRegistro(idXbee, fecha, nivel, mensaje) VALUES(?, CURRENT_TIMESTAMP(), ?, ?);', [peticion.idXbee, peticion.nivel, peticion.mensaje]) // Se inserta un nuevo registro
                        .then(results => { // Si la inserción es exitosa
                            if (results != null && results.affectedRows > 0) { // Si se afectó al menos un registro
                                respuesta.mensaje = "Registro exitoso"; // Se asigna a la clave "mensaje" un mensaje que describa la inserción exitosa en el JSON respuesta
                                res.status(201).send(respuesta); // Se envía el JSON respuesta al cliente con un código 201 (Created)
                            } else { // Si no se afectó ningún registro
                                respuesta.error = true; // Se cambia el valor de la clave "error" a verdadero en el JSON respuesta
                                respuesta.mensaje = "No se pudo registrar el nuevo registro"; // Se asigna a la clave "mensaje" un mensaje que describa el error en el JSON respuesta
                                res.status(400).send(respuesta); // Se envía el JSON respuesta al cliente con un código 400 (Bad Request)
                            }
                        })
                        .catch(error => { // Si la inserción no es exitosa
                            console.log(error);
                            respuesta.error = true; // Se cambia el valor de la clave "error" a verdadero en el JSON respuesta
                            respuesta.mensaje = "Ocurrió un error no controlado"; // Se asigna a la clave "mensaje" un mensaje que describa el error en el JSON respuesta
                            res.status(500).send(respuesta); // Se envía el JSON respuesta al cliente con un código 500 (Internal Server Error)
                        });
                }
            })
            .catch(error => { // Si la consulta no es exitosa
                console.log(error);
                respuesta.error = true; // Se cambia el valor de la clave "error" a verdadero en el JSON respuesta
                respuesta.mensaje = "Ocurrió un error no controlado "; // Se asigna a la clave "mensaje" un mensaje que describa el error en el JSON respuesta
                res.status(500).send(respuesta); // Se envía el JSON respuesta al cliente con un código 500 (Internal Server Error)
            });
    }


    //* Consulta a la base de datos con uso del procedimiento almacenado registrarXbeeRegistro
    // bd.query('CALL registrarXbeeRegistro(?, ?, ?, @pError, @pMensajeOperacion, @pIdXbeeRegistro);'
    //     + 'SELECT @pError AS error, @pMensajeOperacion AS mensaje, @pIdXbeeRegistro AS idXbeeRegistro;', [peticion.idXbee, peticion.nivel, peticion.mensaje]) // Se realiza una consulta para registrar un nuevo registro
    //     .then(results => { // Si la consulta es exitosa
    //         if (results[1] != null && results[1].length > 0) { // Si hay registros
    //             respuesta.error = results[1][0].error == 1; // Se asigna a la clave "error" el valor del error obtenido
    //             respuesta.mensaje = results[1][0].mensaje; // Se asigna a la clave "mensaje" el valor del mensaje obtenido
    //             idXbeeRegistro = results[1][0].idXbeeRegistro; // Se asigna a la variable idXbeeRegistro el valor del idXbeeRegistro obtenido
    //         }
    //         res.status(200).send(respuesta); // Se envía el JSON respuesta al cliente con un código 200 (OK)
    //     })
    //     .then(() => { // Si la consulta es exitosa
    //         if (idXbeeRegistro > 0) { // Si el idXbeeRegistro es mayor a cero
    //             bd.query('CALL obtenerXbeeRegistros(?, ?, ?, ?);', [null, null, null, idXbeeRegistro]) // Se realiza una consulta para obtener el registro recién insertado
    //                 .then(results => { // Si la consulta es exitosa
    //                     if (results != null && results.length > 0) { // Si hay registros
    //                         respuesta.registros = results[0] // Se crea la clave "registros" en el JSON respuesta y se le asigna el valor de los registros obtenidos en un JSON anidado
    //                         socket.enviarMensaje("nuevoRegistro", results[0][0]); // Se envía un mensaje a través de los sockets con el nombre "nuevoRegistro" y el registro obtenido
    //                     }
    //                 })
    //                 .catch(error => { // Si la consulta no es exitosa
    //                     console.log(error);
    //                 });
    //         }
    //     })
    //     .catch(error => { // Si la consulta no es exitosa
    //         console.log(error);
    //         respuesta.error = true; // Se cambia el valor de la clave "error" a verdadero en el JSON respuesta
    //         respuesta.mensaje = "Ocurrió un error no controlado."; // Se asigna a la clave "mensaje" un mensaje que describa el error en el JSON respuesta
    //         res.status(500).send(respuesta); // Se envía el JSON respuesta al cliente con un código 500 (Internal Server Error)
    //     });
}

module.exports = { // Se exportan los métodos para ser llamados en las rutas
    //GET
    obtenerXbees,
    obtenerXbeeRegistros,
    //POST
    registrarXbee,
    registrarXbeeRegistro
};