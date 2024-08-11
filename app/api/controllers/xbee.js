//! CONFIGURACIÓN DE LOS MÉTODOS HTTP PARA LA TABLA "XBEE"
//? En este controlador se definen los métodos GET y POST para la tabla "xbee" de la base de datos.

'use strict' // Uso de características de ECMAScript 6
import bd from '../db/conexion_bd.js'; // Se llama a la configuración de la conexión con la base de datos
import json_response from '../models/json_response.js'; // Se llama a la clase JSON Response

//* <-------------------- GET -------------------->

function consultar_xbee(req, res) {
    let json = new json_response(); // Se crea un objeto de la clase JSON Response
    let consulta_sql = 'SELECT * FROM xbee;'; // Se crea una variable para almacenar la consulta SQL
    if (req.query.id) { // Si el cliente envía un parámetro de consulta id
        consulta_sql = 'SELECT * FROM xbee WHERE id_xbee = ' + req.query.id + ';'; // Se modifica la consulta SQL para obtener un registro específico
    }
    // Se realiza una consulta a la base de datos para obtener todos los registros de la tabla xbee
    bd.query(consulta_sql)
        .then(results => {
            if (results.rowCount > 0) { // Si hay registros
                console.log('GET /xbee HTTPS/1.1 200 OK');
                json.mensaje = "Consulta exitosa";
                json.xbee = results.rows; // Se crea la clave "xbee" en el JSON Response y se asigna el valor de los registros obtenidos
                res.status(200).send(json); // Se envía el JSON Response al cliente con un código 200 (OK)
            } else {
                console.log('GET /xbee HTTPS/1.1 200 OK');
                json.mensaje = "No se encontraron registros de XBee";
                res.status(200).send(json);
            }
        })
        .catch(error => {
            console.log('GET /xbee HTTPS/1.1 500 Internal Server Error');
            json.error = true;
            json.mensaje = "Hubo un error en el servidor";
            res.status(500).send(json); // Se envía el JSON Response al cliente con un código 500 (Internal Server Error)
        });
}

//* <-------------------- POST/PUT -------------------->

function insertar_xbee(req, res) {
    let body = req.body; // Se crea una variable para almacenar los parámetros del body que manda el cliente en la petición
    let json = new json_response();
    let id_xbee; // Se crea una variable para almacenar el id_xbee
    // Consulta a la base de datos sin uso del procedimiento almacenado registrarXbee
    bd.query('SELECT id_xbee FROM xbee WHERE nombre = $1;', [body.nombre]) // Se realiza una consulta para obtener el id_xbee en caso de que ya exista un XBee con el mismo nombre
        .then(results => {
            if (results.rowCount == 0) { // Si no existe un XBee con el mismo nombre, se inserta un nuevo XBee
                bd.query('INSERT INTO xbee(nombre, latitud, longitud, fecha_registro) VALUES($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *;', [body.nombre, body.latitud, body.longitud])
                    .then(results => {
                        if (results.rowCount > 0) { // Si se afectó al menos un registro
                            console.log('POST /xbee HTTPS/1.1 201 Created');
                            json.mensaje = "El XBee se ha insertado exitosamente";
                            json.xbee = results.rows;
                            res.status(201).send(json); // Se envía el JSON Response al cliente con un código 201 (Created)
                        } else {
                            console.log('POST /xbee HTTPS/1.1 400 Bad Request');
                            json.error = true;
                            json.mensaje = "Hubo un problema al insertar el XBee";
                            res.status(400).send(json); // Se envía el JSON Response al cliente con un código 400 (Bad Request)
                        }
                    })
                    .catch(error => {
                        console.log('POST /xbee HTTPS/1.1 500 Internal Server Error');
                        json.error = true;
                        json.mensaje = "Hubo un problema en el servidor";
                        res.status(500).send(json);
                    });
            } else { // Si hay un XBee con el mismo nombre se actualizan sus datos
                id_xbee = results.rows[0].id_xbee; // Se asigna el valor del id_xbee a la variable id_xbee
                bd.query('UPDATE xbee SET latitud = $1, longitud = $2, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id_xbee = $3 RETURNING *;', [body.latitud, body.longitud, id_xbee])
                    .then(results => {
                        if (results.rowCount > 0) { // Si se afectó al menos un registro
                            console.log('PUT /xbee HTTPS/1.1 200 OK');
                            json.mensaje = "El XBee se ha actualizado exitosamente";
                            json.xbee = results.rows;
                            res.status(200).send(json);
                        } else {
                            console.log('PUT /xbee HTTPS/1.1 400 Bad Request');
                            json.error = true;
                            json.mensaje = "Hubo un problema al actualizar el XBee";
                            res.status(400).send(json);
                        }
                    })
                    .catch(error => {
                        console.log('PUT /xbee HTTPS/1.1 500 Internal Server Error');
                        json.error = true;
                        json.mensaje = "Hubo un problema en el servidor";
                        res.status(500).send(json);
                    });
            }
        })
        .catch(error => {
            console.log('POST /xbee HTTPS/1.1 500 Internal Server Error');
            json.error = true;
            json.mensaje = "Hubo un problema en el servidor";
            res.status(500).send(json);
        });
}

//* <-------------------- DELETE -------------------->

function eliminar_xbee(req, res) {
    let id_xbee = req.params.id; // Se obtiene el parámetro de la url
    let json = new json_response();
    // Se realiza una consulta a la base de datos para eliminar un registro de XBee
    bd.query('DELETE FROM xbee WHERE id_xbee = $1 RETURNING *;', [id_xbee])
        .then(results => {
            if (results.rowCount > 0) { // Si se afectó al menos un registro
                console.log('DELETE /xbee/' + id_xbee + ' HTTPS/1.1 200 OK');
                json.mensaje = "El XBee se ha eliminado exitosamente";
                json.xbee = results.rows;
                res.status(200).send(json);
            } else {
                console.log('DELETE /xbee/' + id_xbee + ' HTTPS/1.1 400 Bad Request');
                json.error = true;
                json.mensaje = "Hubo un problema al eliminar el XBee";
                res.status(400).send(json);
            }
        })
        .catch(error => {
            console.log('DELETE /xbee/' + id_xbee + ' HTTPS/1.1 500 Internal Server Error');
            json.error = true;
            json.mensaje = "Hubo un problema en el servidor";
            res.status(500).send(json);
        });
}

export default { // Se exportan los métodos para ser llamados en las rutas
    //GET
    consultar_xbee,
    //POST/PUT
    insertar_xbee,
    //DELETE
    eliminar_xbee
};