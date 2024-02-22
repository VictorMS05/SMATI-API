USE monitoreo;
CREATE TABLE xbee
(
    idXbee INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    latitud DECIMAL(10, 6),
    longitud DECIMAL(10, 6),
    fechaRegistro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion DATETIME,
    PRIMARY KEY(idXbee),
    CONSTRAINT UQ_xbee_nombre UNIQUE(nombre)
);