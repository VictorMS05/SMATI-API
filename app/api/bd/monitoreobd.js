const mysql = require('mysql');
const { promisify } = require('util');
const conexionBD = require('./appconfig.json').conexionDB;

const pool = mysql.createPool(conexionBD);
pool.getConnection((err, con) => {
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

    if (con) {
        con.release();
    }

    console.log('La conexión a la base de datos está lista.');
    return;
});

pool.query = promisify(pool.query);
module.exports = pool;