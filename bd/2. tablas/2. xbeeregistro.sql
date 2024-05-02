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

-- * <---------- PostgreSQL ---------->
CREATE TABLE xbee_registro
(
    id_xbee_registro SERIAL PRIMARY KEY,
    id_xbee INTEGER NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nivel INTEGER NOT NULL,
    mensaje VARCHAR(25) NOT NULL,
    FOREIGN KEY (id_xbee) REFERENCES xbee(id_xbee)
);