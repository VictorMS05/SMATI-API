//! CONFIGURACIÓN DE LA CONEXIÓN A LA BASE DE DATOS
//? Una base de datos es un conjunto de datos pertenecientes a un mismo contexto y almacenados sistemáticamente para su posterior uso. En esta API se utiliza una base de datos MySQL para almacenar la información de los dispositivos Xbee y los registros.

require('dotenv').config(); // Se llama al módulo para el manejo de variables de entorno

const { promisify } = require('util'); // Se llama al módulo para convertir las consultas a promesas

//* Configuración de la base de datos para la conexión con el módulo mysql (Requiere el archivo appconfig.json)
// const mysql = require('mysql'); // Se llama al módulo para la conexión con la base de datos
// const fs = require('fs'); // Se llama al módulo para el manejo de archivos
// const rawConfig = fs.readFileSync('api/bd/appconfig.json'); // Leer el archivo de configuración
// const config = JSON.parse(rawConfig); // Convertir el archivo de configuración a un objeto JSON
// config.conexionDB.host = process.env.DB_HOST; // Reemplazar los marcadores de posición con valores de variables de entorno
// config.conexionDB.port = process.env.DB_PORT;
// config.conexionDB.user = process.env.DB_USER;
// config.conexionDB.password = process.env.DB_PASSWORD;
// config.conexionDB.database = process.env.DB_NAME;
// const conexionBD = config.conexionDB; // Se guarda la configuración de la base de datos en una variable
// const pool = mysql.createPool(conexionBD); // Se crea un pool de conexiones con la variable que contiene la configuración de la base de datos

//* Configuración de la base de datos para la conexión con el módulo mysql2 (No requiere el archivo appconfig.json)
const mysql = require('mysql2'); // Se llama al módulo para la conexión con la base de datos
const pool = mysql.createPool(process.env.DB_URL); // Se crea un pool de conexiones con el url de la base de datos

//* Conexión a la base de datos
pool.getConnection((err, con) => { // Se establece la conexión con la base de datos
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('La conexión fue cerrada.');
        }
        else if (err.code === 'ERR_CON_COUNT_ERROR') {
            console.log('La base de datos tiene muchas onexiones abiertas.')
        }
        else if (err.code === 'ECONREFUSED') {
            console.log('Conexión rechazada.')
        }
    }

    if (con) { // Si la conexión fue exitosa, se libera el pool de conexiones
        con.release(); // Se libera la conexión
    }

    console.log('La conexión a la base de datos está lista.');
    return; // Se retorna para finalizar la conexión
});

pool.query = promisify(pool.query); // Convertir las consultas a promesas

module.exports = pool; // Exportar el pool de conexiones para su uso en otros archivos