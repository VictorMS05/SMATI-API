//! CONFIGURACIÓN DE LOS MÉTODOS HTTP PARA LA API
//? Los métodos HTTP son un conjunto de reglas que permiten a los clientes y servidores comunicarse. Los métodos más comunes son GET, POST, PUT, DELETE, OPTIONS y PATCH. En esta API se utilizan los métodos GET y POST para obtener y enviar información, respectivamente.

'use strict' // Uso de características de ECMAScript 6
var bd = require('../bd/monitoreobd'); // Se llama a la configuración de la conexión con la base de datos
var Respuesta = require('../modelos/respuesta'); // Se llama a la configuración del JSON de respuesta
const socket = require('../sockets'); // Se llama a la configuración de los sockets
const fastCsv = require('fast-csv'); // Se llama al módulo fast-csv para la generación de archivos CSV
const moment = require('moment'); // Se llama al módulo moment para el manejo de fechas y horas

//* <-------------------- GET -------------------->

//* <---------- Xbee ---------->

function obtenerXbees(req, res) {
    // Se crea un nuevo JSON de respuesta a partir de la configuración de respuesta.js
    let respuesta = new Respuesta();
    // Se realiza una consulta a la base de datos para obtener todos los registros de la tabla xbee
    bd.query('SELECT * FROM xbee;')
        .then(results => { // Si la consulta es exitosa
            if (results.rowCount > 0) { // Si hay registros
                // Se crea la clave "xbees" en el JSON respuesta y se le asigna el valor de los registros obtenidos en un JSON anidado
                respuesta.xbees = results.rows;
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

//* <---------- Nivel ---------->

//* <----- Recientes ----->
function consultarNivelesRecientes(req, res) {
    let respuesta = new Respuesta(); // Se crea un nuevo JSON de respuesta a partir de la configuración de respuesta.js
    let arreglo = []; // Se crea un arreglo vacío para almacenar los registros obtenidos
    // Se realiza una consulta a la base de datos para obtener los 2 registros más recientes de la tabla xbee_registro
    bd.query('SELECT x.id_xbee, x.nombre, xr.fecha, xr.nivel, xr.mensaje FROM xbee_registro AS xr INNER JOIN xbee AS x ON xr.id_xbee = x.id_xbee ORDER BY xr.fecha DESC, x.id_xbee ASC LIMIT 2;')
        .then(results => { // Si la consulta es exitosa
            if (results.rowCount > 0) { // Si hay registros
                arreglo.push(results.rows[0]); // Se añade el primer registro al arreglo
                if (results.rows[1] != null && results.rows[1].id_xbee != results.rows[0].id_xbee) { // Si el segundo registro es de un xbee diferente al primero
                    arreglo.push(results.rows[1]); // Se añade el segundo registro al arreglo
                }
                // Se crea la clave "niveles" en el JSON respuesta y se le asigna el valor del arreglo
                respuesta.niveles = arreglo;
                respuesta.mensaje = "Consulta exitosa"; // Se asigna a la clave "mensaje" un mensaje que describa la consulta exitosa en el JSON respuesta
                res.status(200).send(respuesta); // Se envía el JSON respuesta al cliente con un código 200 (OK)
            } else { // Si no hay registros
                respuesta.mensaje = "No hay registros de niveles"; // Se asigna a la clave "mensaje" un mensaje que describa que no hay registros en el JSON respuesta
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

//* <----- Historial ----->
function obtenerXbeeRegistros(req, res) {
    let respuesta = new Respuesta(); // Se crea un nuevo JSON de respuesta a partir de la configuración de respuesta.js
    let exportar = false; // Se inicializa la variable exportar en falso

    if (req.query.exportar && (req.query.exportar == 1 || req.query.exportar == 'true')) exportar = true; // Si el parámetro exportar es verdadero, se cambia el valor de la variable exportar a verdadero

    // Consulta a la base de datos
    bd.query('SELECT xr.id_xbee_registro, x.id_xbee, x.nombre, xr.fecha, xr.nivel, xr.mensaje FROM xbee_registro AS xr INNER JOIN xbee AS x ON xr.id_xbee = x.id_xbee')
        .then(results => { // Si la consulta es exitosa
            if (results.rowCount > 0) { // Si hay registros
                respuesta.registros = results.rows; // Se crea la clave "registros" en el JSON respuesta y se le asigna el valor de los registros obtenidos en un JSON anidado
                respuesta.mensaje = "Consulta exitosa"; // Se asigna a la clave "mensaje" un mensaje que describa la consulta exitosa en el JSON respuesta
            } else { // Si no hay registros
                respuesta.mensaje = "No hay registros de xbees"; // Se asigna a la clave "mensaje" un mensaje que describa que no hay registros en el JSON respuesta
            }
            if (!exportar) { // Si la variable exportar es falsa
                res.status(200).send(respuesta); // Se envía el JSON respuesta al cliente con un código 200 (OK)
                return;
            }

            if (respuesta.registros == null || typeof respuesta.registros == 'undefined') respuesta.registros = []; // Si no hay registros, se crea un arreglo vacío en la clave "registros" del JSON respuesta

            //? Se crea un archivo CSV con los registros obtenidos
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
        .catch(error => { // Si la consulta no es exitosa
            console.log(error);
            respuesta.error = true; // Se cambia el valor de la clave "error" a verdadero en el JSON respuesta
            respuesta.mensaje = "Ocurrió un error no controlado"; // Se asigna a la clave "mensaje" un mensaje que describa el error en el JSON respuesta
            res.status(500).send(respuesta); // Se envía el JSON respuesta al cliente con un código 500 (Internal Server Error)
        });
}

//* <-------------------- POST -------------------->

//* <---------- Xbee ---------->

function registrarXbee(req, res) {
    let respuesta = new Respuesta(); // Se crea un nuevo JSON de respuesta a partir de la configuración de respuesta.js
    let peticion = req.body; // Se crea una variable para almacenar los parámetros del body que manda el cliente en la petición
    let id_xbee; // Se crea una variable para almacenar el idXbee

    // Consulta a la base de datos sin uso del procedimiento almacenado registrarXbee
    bd.query('SELECT id_xbee FROM xbee WHERE nombre = $1;', [peticion.nombre]) // Se realiza una consulta para obtener el idXbee en caso de que ya exista un xbee con el mismo nombre
        .then(results => { // Si la consulta es exitosa
            if (results.rowCount > 0) { // Si hay registros
                id_xbee = results.rows[0].id_xbee; // Se asigna el valor del idXbee a la variable idXbee
                bd.query('UPDATE xbee SET latitud = $1, longitud = $2, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id_xbee = $3;', [peticion.latitud, peticion.longitud, id_xbee]) // Si ya existe un xbee con el mismo nombre, se actualizan los datos de latitud y longitud
                    .then(results => { // Si la actualización es exitosa
                        if (results.rowCount > 0) { // Si se afectó al menos un registro
                            respuesta.mensaje = "Actualización exitosa"; // Se asigna a la clave "mensaje" un mensaje que describa la actualización exitosa en el JSON respuesta
                            respuesta.id_xbee = id_xbee; // Se asigna a la clave "id_xbee"
                            res.status(200).send(respuesta); // Se envía el JSON respuesta al cliente con un código 202 (Accepted)
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
                bd.query('INSERT INTO xbee(nombre, latitud, longitud, fecha_registro, fecha_actualizacion) VALUES($1, $2, $3, CURRENT_TIMESTAMP, NULL);', [peticion.nombre, peticion.latitud, peticion.longitud]) // Si no existe un xbee con el mismo nombre, se inserta un nuevo registro
                    .then(results => { // Si la inserción es exitosa
                        if (results.rowCount > 0) { // Si se afectó al menos un registro
                            bd.query('SELECT id_xbee FROM xbee WHERE nombre = $1;', [peticion.nombre]) // Se realiza una consulta para obtener el idXbee del nuevo xbee
                                .then(results => { // Si la consulta es exitosa
                                    respuesta.mensaje = "Registro exitoso"; // Se asigna a la clave "mensaje" un mensaje que describa la inserción exitosa en el JSON respuesta
                                    respuesta.id_xbee = results.rows[0].id_xbee; // Se asigna a la clave "id_xbee" el valor del idXbee en el JSON respuesta
                                    res.status(201).send(respuesta); // Se envía el JSON respuesta al cliente con un código 201 (Created)
                                }
                                )
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
}

//* <---------- Nivel ---------->

function registrarXbeeRegistro(req, res) {
    let respuesta = new Respuesta(); // Se crea un nuevo JSON de respuesta a partir de la configuración de respuesta.js
    let peticion = req.body; // Se crea una variable para almacenar los parámetros del body que manda el cliente en la petición
    // let idXbeeRegistro = 0;

    // Consulta a la base de datos sin uso del procedimiento almacenado registrarXbeeRegistro
    if (peticion.id_xbee == 0 || peticion.id_xbee == null || peticion.id_xbee == undefined) { // Si el idXbee es nulo, cero o indefinido
        respuesta.error = true; // Se cambia el valor de la clave "error" a verdadero en el JSON respuesta
        respuesta.mensaje = "El id_xbee es requerido"; // Se asigna a la clave "mensaje" un mensaje que describa el error en el JSON respuesta
        res.status(400).send(respuesta); // Se envía el JSON respuesta al cliente con un código 400 (Bad Request)
        return; // Se termina la ejecución del método
    } else { // Si el idXbee no es nulo, cero o indefinido
        bd.query('INSERT INTO xbee_registro(id_xbee, fecha, nivel, mensaje) VALUES($1, CURRENT_TIMESTAMP, $2, $3);', [peticion.id_xbee, peticion.nivel, peticion.mensaje.toUpperCase()]) // Se inserta un nuevo registro
            .then(results => { // Si la inserción es exitosa
                if (results.rowCount > 0) { // Si se afectó al menos un registro
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
}

module.exports = { // Se exportan los métodos para ser llamados en las rutas
    //GET
    obtenerXbees,
    consultarNivelesRecientes,
    obtenerXbeeRegistros,
    //POST
    registrarXbee,
    registrarXbeeRegistro
};