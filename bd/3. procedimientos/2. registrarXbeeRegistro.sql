USE monitoreo;
DROP PROCEDURE IF EXISTS registrarXbeeRegistro;
DELIMITER $$
CREATE PROCEDURE registrarXbeeRegistro(IN pIdXbee INT, pNivel INT, pMensaje VARCHAR(200),
    OUT pError TINYINT, OUT pMensajeOperacion VARCHAR(200), OUT pIdXbeeRegistro INT)
sp: BEGIN
    IF pIdXbee > 0
    THEN
        INSERT INTO xbeeRegistro(idXbee, fecha, nivel, mensaje)
        VALUES(pIdXbee, CURRENT_TIMESTAMP(), pNivel, pMensaje);

        SET pIdXbeeRegistro = LAST_INSERT_ID();
    END IF;

    IF IFNULL(pIdXbeeRegistro, 0) > 0
    THEN
        SET pError = 0, pMensajeOperacion = 'Registro realizado.';
    ELSE
        SET pError = 1, pMensajeOperacion = 'No se realizó el registro.';
    END IF;
END $$
DELIMITER ;
