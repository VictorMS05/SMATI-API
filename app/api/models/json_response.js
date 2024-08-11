//! CONFIGURACIÓN DEL JSON RESPONSE DE LA API
//? Un JSON Response es un JSON que se utiliza para devolver el resultado de una petición. Si hubo un error, se cambia el valor de la clave "error" a verdadero y se asigna un mensaje a la clave "mensaje" que describa el error. Si no hubo error, se mantiene el valor de la clave "error" en falso y la clave "mensaje" en nulo.

'use strict' // Uso de características de ECMAScript 6
/**
 * json_response
 * @description :: Clase para devolver el resultado de una petición.
 */
class json_response { // Se define la clase json_response
    constructor() { // Se construye la estructura del JSON Response
        this.error = false, // Se inicializa la clave "error" con valor falso y si hay un error se cambia a verdadero
            this.mensaje = null // Se inicializa la clave "mensaje" con valor nulo y si hay un error se cambia el valor a un mensaje que describa el error
    }
}

export default json_response; // Se exporta la clase json_response para ser llamada en los controladores