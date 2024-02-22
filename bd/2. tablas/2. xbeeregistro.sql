USE monitoreo;
CREATE TABLE xbeeRegistro
(
    idXbeeRegistro INT NOT NULL AUTO_INCREMENT,
    idXbee INT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nivel INT NOT NULL,
    mensaje VARCHAR(200),
    PRIMARY KEY(idXbeeRegistro)
);