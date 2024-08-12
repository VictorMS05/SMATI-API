//! CONFIGURACIÓN DE LOS MÉTODOS HTTP PARA LA TABLA "NIVEL"
//? En este controlador se definen los métodos GET y POST para la tabla "nivel" de la base de datos.

'use strict' // Uso de características de ECMAScript 6
import bd from '../db/conexion_bd.js'; // Se llama a la configuración de la conexión con la base de datos
import json_response from '../models/json_response.js'; // Se llama a la clase JSON Response

//* <-------------------- GET -------------------->

function consultar_nivel(req, res) {
    const id = req.params.id; // Se crea una variable para almacenar el parámetro de la ruta que manda el cliente en la url
    const periodo_de_tiempo = req.query.periodo_de_tiempo; // Se crea una variable para almacenar el parámetro de la consulta que manda el cliente en la url
    let consulta_sql = ''; // Se crea una variable para almacenar la consulta SQL
    let json = new json_response(); // Se crea un objeto de la clase JSON Response
    switch (periodo_de_tiempo) {
        case 'reciente':
            consulta_sql = 'SELECT x.nombre, n.nivel, r.altura, r.mensaje, r.indicacion FROM nivel AS n INNER JOIN xbee AS x ON n.id_xbee = x.id_xbee INNER JOIN riesgo AS r ON n.nivel = r.nivel WHERE n.id_xbee = $1 AND n.fecha >= NOW() - INTERVAL \'3 seconds\' ORDER BY n.fecha DESC LIMIT 1;';
            break;
        case 'tiempo_real':
            consulta_sql = 'SELECT x.nombre, TO_CHAR(n.fecha AT TIME ZONE \'America/Mexico_City\', \'HH24:MI:SS\') AS hora, n.nivel, r.altura FROM nivel AS n INNER JOIN xbee AS x ON n.id_xbee = x.id_xbee INNER JOIN riesgo AS r ON n.nivel = r.nivel WHERE n.id_xbee = $1 AND n.fecha >= NOW() - INTERVAL \'121 seconds\' ORDER BY n.fecha DESC LIMIT 60;';
            break;
        case '24_horas':
            consulta_sql = 'SELECT x.nombre, TO_CHAR(DATE_TRUNC(\'hour\', n.fecha AT TIME ZONE \'America/Mexico_City\'), \'HH24:MI\') AS hora, ROUND(AVG(n.nivel), 1) AS promedio_nivel, CONCAT(ROUND(AVG(n.nivel)*30, 2), \' cm\') AS promedio_altura FROM nivel AS n INNER JOIN xbee AS x ON n.id_xbee = x.id_xbee WHERE n.id_xbee = 1 AND n.fecha >= NOW() - INTERVAL \'24 hours\' GROUP BY x.nombre, hora ORDER BY hora DESC LIMIT 24;';
            break;
        case '7_dias':
            consulta_sql = 'SELECT x.nombre, TO_CHAR(DATE_TRUNC(\'day\', n.fecha), \'DD/MM/YYYY\') AS dia, ROUND(AVG(n.nivel), 1) AS promedio_nivel, CONCAT(ROUND(AVG(n.nivel)*30, 2), \' cm\') AS promedio_altura FROM nivel AS n INNER JOIN xbee AS x ON n.id_xbee = x.id_xbee WHERE n.id_xbee = $1 AND n.fecha >= NOW() - INTERVAL \'7 days\' GROUP BY x.nombre, dia ORDER BY dia DESC LIMIT 7;';
            break;
        case '30 dias':
            consulta_sql = 'SELECT x.nombre, TO_CHAR(DATE_TRUNC(\'day\', n.fecha), \'DD/MM/YYYY\') AS dia, ROUND(AVG(n.nivel), 1) AS promedio_nivel, CONCAT(ROUND(AVG(n.nivel)*30, 2), \' cm\') AS promedio_altura FROM nivel AS n INNER JOIN xbee AS x ON n.id_xbee = x.id_xbee WHERE n.id_xbee = $1 AND n.fecha >= NOW() - INTERVAL \'30 days\' GROUP BY x.nombre, dia ORDER BY dia DESC LIMIT 30;';
            break;
        case '12_meses':
            consulta_sql = 'SELECT x.nombre, TO_CHAR(DATE_TRUNC(\'month\', n.fecha), \'MM/YYYY\') AS mes, ROUND(AVG(n.nivel), 1) AS promedio_nivel, CONCAT(ROUND(AVG(n.nivel)*30, 2), \' cm\') AS promedio_altura FROM nivel AS n INNER JOIN xbee AS x ON n.id_xbee = x.id_xbee WHERE n.id_xbee = $1 AND n.fecha >= NOW() - INTERVAL \'12 months\' GROUP BY x.nombre, mes ORDER BY mes DESC LIMIT 12;';
            break;
        default:
            consulta_sql = 'SELECT x.nombre, n.fecha, n.nivel, r.altura, r.mensaje, r.indicacion FROM nivel AS n INNER JOIN xbee AS x ON n.id_xbee = x.id_xbee INNER JOIN riesgo AS r ON n.nivel = r.nivel WHERE n.id_xbee = $1';
    }
    // Se realiza una consulta a la base de datos para obtener el registro del nivel del dispositivo Xbee
    bd.query(consulta_sql, [id])
        .then(results => {
            if (results.rowCount > 0) { // Si hay registros
                console.log('GET /api/nivel/' + id + ' HTTPS/1.1 200 OK');
                json.mensaje = "Consulta exitosa";
                json.nivel = results.rows; // Se crea la clave "nivel" en el JSON Response y se asigna el valor de los registros obtenidos
                res.status(200).send(json); // Se envía el JSON Response al cliente con un código 200 (OK)
            } else {
                console.log('GET /api/nivel/' + id + ' HTTPS/1.1 200 OK');
                json.mensaje = "No se encontró un registro del nivel";
                res.status(200).send(json);
            }
        })
        .catch(error => {
            console.log('GET /api/nivel/' + id + ' HTTPS/1.1 500 Internal Server Error');
            json.error = true;
            json.mensaje = "Hubo un error en el servidor";
            res.status(500).send(json); // Se envía el JSON respuesta al cliente con un código 500 (Internal Server Error)
        });
}

//* <-------------------- POST -------------------->

function insertar_nivel(req, res) {
    const body = req.body; // Se crea una variable para almacenar los parámetros del body que manda el cliente en la petición
    let json = new json_response();
    // Consulta a la base de datos sin uso del procedimiento almacenado registrarXbeeRegistro
    if (body.id_xbee == 0 || body.id_xbee == null || body.id_xbee == undefined) {
        console.log('POST /api/nivel HTTPS/1.1 400 Bad Request');
        json.error = true;
        json.mensaje = "El id_xbee es requerido";
        res.status(400).send(json); // Se envía el JSON Response al cliente con un código 400 (Bad Request)
        return;
    } else {
        bd.query('INSERT INTO nivel(id_xbee, nivel, fecha) VALUES($1, $2, CURRENT_TIMESTAMP) RETURNING *;', [body.id_xbee, body.nivel])
            .then(results => {
                if (results.rowCount > 0) { // Si se insertó el registro
                    console.log('POST /api/nivel HTTPS/1.1 201 Created');
                    json.mensaje = "El nivel se ha insertado exitosamente";
                    json.nivel = results.rows;
                    res.status(201).send(json); // Se envía el JSON Response al cliente con un código 201 (Created)
                } else {
                    console.log('POST /api/nivel HTTPS/1.1 400 Bad Request');
                    json.error = true;
                    json.mensaje = "Hubo un problema al insertar el nivel";
                    res.status(400).send(json);
                }
            })
            .catch(error => {
                console.log('POST /api/nivel HTTPS/1.1 500 Internal Server Error');
                json.error = true;
                json.mensaje = "Hubo un error en el servidor";
                res.status(500).send(json);
            });
    }
}

export default { // Se exportan los métodos para ser llamados en las rutas
    //GET
    consultar_nivel,
    //POST
    insertar_nivel
};