USE smati;

--* <---------- MySQL ---------->
CREATE TABLE xbee (
    id_xbee INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    latitud DECIMAL(10, 6) NOT NULL,
    longitud DECIMAL(10, 6) NOT NULL,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME,
    PRIMARY KEY(idXbee),
    CONSTRAINT UQ_xbee_nombre UNIQUE(nombre)
);

--* <---------- PostgreSQL ---------->
CREATE TABLE xbee (
    id_xbee SERIAL PRIMARY KEY,
    nombre VARCHAR(25) UNIQUE NOT NULL,
    latitud DECIMAL(10, 6) NOT NULL,
    longitud DECIMAL(10, 6) NOT NULL,
    fecha_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE
);