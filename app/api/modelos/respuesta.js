//! CONFIGURACIÓN DEL JSON RESPUESTA DE LA API
//? Una respuesta es un JSON que se utiliza para devolver el resultado de una petición. Si hubo un error, se cambia el valor de la clave "error" a verdadero y se asigna un mensaje a la clave "mensaje" que describa el error. Si no hubo error, se mantiene el valor de la clave "error" en falso y la clave "mensaje" en nulo.

'use strict' // Uso de características de ECMAScript 6
/**
 * respuesta
 * @description :: Clase para devolver el resultado de una petición.
 */
class respuesta { // Se define la clase respuesta que mandará el resultado de una petición mostrando si hubo un error y un mensaje que lo describa
    constructor() { // Se construye la estructura del JSON que se enviará como respuesta
        this.error = false, // Se inicializa la clave "error" con valor falso y si hay un error se cambia a verdadero
            this.mensaje = null // Se inicializa la clave "mensaje" con valor nulo y si hay un error se cambia el valor a un mensaje que describa el error
    }
}

module.exports = respuesta; // Se exporta la clase respuesta para su uso en otros archivos