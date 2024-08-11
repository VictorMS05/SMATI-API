//! CONFIGURACIÓN DE LOS MÉTODOS HTTP PARA LA TABLA "RIESGO"
//? En este controlador se definen los métodos GET y POST para la tabla "riesgo" de la base de datos.

'use strict' // Uso de características de ECMAScript 6
import bd from '../db/conexion_bd.js'; // Se llama a la configuración de la conexión con la base de datos
import json_response from '../models/json_response.js';  // Se llama a la clase JSON Response

//* <-------------------- GET -------------------->

function consultar_riesgo(req, res) {
    let consulta_sql = 'SELECT * FROM riesgo'; // Se crea una variable para almacenar la consulta SQL
    let json = new json_response(); // Se crea un objeto de la clase JSON Response
    if (req.query.nivel) { // Si el cliente envía un parámetro de consulta en la url
        consulta_sql = 'SELECT * FROM riesgo WHERE nivel = ' + req.query.nivel + ';'; // Se asigna la consulta SQL con el parámetro de consulta
    }
    // Se realiza una consulta a la base de datos para obtener los registros de los riesgos
    bd.query(consulta_sql)
        .then(results => {
            if (results.rowCount > 0) { // Si hay registros
                console.log('GET /riesgo HTTPS/1.1 200 OK');
                json.mensaje = "Consulta exitosa";
                json.riesgo = results.rows; // Se crea la clave "riesgo" en el JSON Response y se asigna el valor de los registros obtenidos
                res.status(200).send(json); // Se envía el JSON Response al cliente con un código 200 (OK)
            } else {
                console.log('GET /riesgo HTTPS/1.1 200 OK');
                json.mensaje = "No se encontró un registro de riesgo";
                json.riesgo = results.rows; // Se crea la clave "riesgo" y se asigna el JSON Response vacio
                res.status(200).send(json);
            }
        })
        .catch(error => {
            console.log('GET /riesgo HTTPS/1.1 500 Internal Server Error');
            json.error = true;
            json.mensaje = "Hubo un error en el servidor";
            res.status(500).send(json); // Se envía el JSON respuesta al cliente con un código 500 (Internal Server Error)
        });
}

//* <-------------------- POST -------------------->

function insertar_riesgo(req, res) {
    const body = req.body; // Se obtiene el cuerpo de la petición
    let json = new json_response();
    // Se realiza una consulta a la base de datos para insertar un registro de riesgo
    bd.query('INSERT INTO riesgo(nivel, altura, mensaje, indicacion) VALUES($1, $2, $3, $4) RETURNING *;', [body.nivel, body.altura, body.mensaje, body.indicacion])
        .then(results => {
            if (results.rowCount > 0) { // Si se insertó el registro
                console.log('POST /riesgo HTTPS/1.1 201 Created');
                json.mensaje = "El riesgo se ha insertado exitosamente";
                json.riesgo = results.rows;
                res.status(201).send(json); // Se envía el JSON Response al cliente con un código 201 (Created)
            } else {
                console.log('POST /riesgo HTTPS/1.1 400 Bad Request');
                json.error = true;
                json.mensaje = "Hubo un problema al registrar el riesgo";
                res.status(400).send(json); // Se envía el JSON respuesta al cliente con un código 400 (Bad Request)
            }
        })
        .catch(error => {
            console.log('POST /riesgo HTTPS/1.1 500 Internal Server Error');
            json.error = true;
            json.mensaje = "Hubo un error en el servidor";
            res.status(500).send(json);
        });
}

//* <-------------------- PUT -------------------->

function actualizar_riesgo(req, res) {
    const nivel = req.params.nivel; // Se obtiene el parámetro de la url
    const body = req.body;
    let json = new json_response();
    // Se realiza una consulta a la base de datos para actualizar un registro de riesgo
    bd.query('UPDATE riesgo SET altura = $1, mensaje = $2, indicacion = $3 WHERE nivel = $4 RETURNING *;', [body.altura, body.mensaje, body.indicacion, nivel])
        .then(results => {
            if (results.rowCount > 0) { // Si se actualizó el registro
                console.log('PUT /riesgo/' + nivel + ' HTTPS/1.1 200 OK');
                json.mensaje = "El riesgo se ha actualizado exitosamente";
                json.riesgo = results.rows;
                res.status(200).send(json);
            } else {
                console.log('PUT /riesgo/' + nivel + ' HTTPS/1.1 400 Bad Request');
                json.error = true;
                json.mensaje = "Hubo un problema al actualizar el riesgo";
                res.status(400).send(json);
            }
        })
        .catch(error => {
            console.log('PUT /riesgo/' + nivel + ' HTTPS/1.1 500 Internal Server Error');
            json.error = true;
            json.mensaje = "Hubo un error en el servidor";
            res.status(500).send(json); // Se envía el JSON respuesta al cliente con un código 500 (Internal Server Error)
        });
}

//* <-------------------- DELETE -------------------->

function eliminar_riesgo(req, res) {
    const nivel = req.params.nivel;
    let json = new json_response();
    // Se realiza una consulta a la base de datos para eliminar un registro de riesgo
    bd.query('DELETE FROM riesgo WHERE nivel = $1 RETURNING *;', [nivel])
        .then(results => {
            if (results.rowCount > 0) { // Si se eliminó el registro
                console.log('DELETE /riesgo/' + nivel + ' HTTPS/1.1 200 OK');
                json.mensaje = "El riesgo se ha eliminado exitosamente";
                json.riesgo = results.rows;
                res.status(200).send(json);
            } else {
                console.log('DELETE /riesgo/' + nivel + ' HTTPS/1.1 400 Bad Request');
                json.error = true;
                json.mensaje = "Hubo un problema al eliminar el riesgo";
                res.status(400).send(json);
            }
        })
        .catch(error => {
            console.log('DELETE /riesgo/' + nivel + ' HTTPS/1.1 500 Internal Server Error');
            json.error = true;
            json.mensaje = "Hubo un error en el servidor";
            res.status(500).send(json);
        });
}

export default { // Se exportan los métodos para ser llamados en las rutas
    //GET
    consultar_riesgo,
    //POST
    insertar_riesgo,
    //PUT
    actualizar_riesgo,
    //DELETE
    eliminar_riesgo
};