USE monitoreo;
DROP PROCEDURE IF EXISTS obtenerXbeeRegistros;
DELIMITER $$
CREATE PROCEDURE obtenerXbeeRegistros(IN pIdXbee INT, IN pFechaDesde DATETIME, IN pFechaHasta DATETIME, 
	IN pIdXbeeRegistro INT)
sp: BEGIN
	IF pFechaDesde IS NULL AND pIdXbeeRegistro IS NULL
	THEN
		SET pFechaDesde = DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL -5 MINUTE);
	END IF;

	SELECT xr.idXbeeRegistro, x.idXbee, x.nombre, xr.fecha, xr.nivel, xr.mensaje
	FROM xbeeRegistro AS xr
	INNER JOIN xbee AS x ON xr.idXbee = x.idXbee
	WHERE (pIdXbee IS NULL OR xr.idXbee = pIdXbee)
		AND (pFechaDesde IS NULL OR xr.fecha >= pFechaDesde)
		AND (pFechaHasta IS NULL OR xr.fecha <= pFechaHasta)
		AND (pIdXbeeRegistro IS NULL OR xr.idXbeeRegistro = pIdXbeeRegistro);
END $$
DELIMITER ;
