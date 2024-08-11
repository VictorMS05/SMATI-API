//! CONFIGURACIÓN DE LA CONEXIÓN A LA BASE DE DATOS
//? En esta API se utiliza una base de datos PostgreSQL para almacenar la información de los dispositivos Xbee y los registros.

//* Configuración de la base de datos postgresql para la conexión con el módulo pg (Requiere el archivo appconfig.json)
import pkg from 'pg'; // Se llama al módulo de la biblioteca pg
import dotenv from 'dotenv'; // Se llama al módulo para el manejo de variables de entorno
dotenv.config(); // Se llama a la configuración de las variables de entorno
const { Pool } = pkg; // Se obtiene la clase Pool de la biblioteca pg
const pool = new Pool({ // Se crea un nuevo pool de conexiones con la URL de la base de datos
    // Se obtiene la URL de la base de datos desde las variables de entorno
    connectionString: process.env.POSTGRES_URL
})

//* Conexión a la base de datos (PostgreSQL)
const query = (text, params) => { // Se crea una función para realizar consultas a la base de datos
    return new Promise((resolve, reject) => { // Se crea una promesa para la consulta
        pool.connect((err, client, release) => { // Se conecta al pool de conexiones
            if (err) { // Si hay un error en la conexión
                reject(err); // Se rechaza la promesa
                return;
            }
            //! <---------- BANDERA DE CONSULTA ---------->
            // console.log('Text: ' + text + ' Params: ' + params);
            client.query(text, params, (err, res) => { // Se realiza la consulta a la base de datos
                release(); // Se libera la conexión
                if (err) { // Si hay un error en la consulta
                    reject(err); // Se rechaza la promesa
                } else { // Si la consulta se realiza correctamente
                    resolve(res); // Se resuelve la promesa con el resultado de la consulta
                }
            });
        });
    });
};

export default { query }; // Se exporta la función de consulta a la base de datos