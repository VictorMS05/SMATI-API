USE monitoreo;
DROP PROCEDURE IF EXISTS registrarXbee;
DELIMITER $$
CREATE PROCEDURE registrarXbee(IN pNombre VARCHAR(50), pLatitud DECIMAL(10, 6), pLongitud DECIMAL(10, 6),
    OUT pIdXbee INT)
sp: BEGIN
    -- Buscar Xbee por nombre
    SELECT idXbee INTO pIdXbee 
    FROM xbee
    WHERE nombre = pNombre;

    IF pIdXbee > 0
    THEN
        -- Actualizar el que existe
        UPDATE xbee SET latitud = pLatitud, longitud = pLongitud, fechaActualizacion = CURRENT_TIMESTAMP()
        WHERE idXbee = pIdXbee;
    ELSE
        -- Registrar uno nuevo
        INSERT INTO xbee(nombre, latitud, longitud)
        VALUES(pNombre, pLatitud, pLongitud);

        SELECT idXbee INTO pIdXbee
        FROM xbee
        WHERE idXbee = LAST_INSERT_ID();
    END IF;
END $$
DELIMITER ;