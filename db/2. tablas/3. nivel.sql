USE smati;

--* <---------- MySQL ---------->
CREATE TABLE nivel (
    id_nivel INT NOT NULL AUTO_INCREMENT,
    id_xbee INT NOT NULL,
    nivel INT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id_nivel),
    FOREIGN KEY(id_xbee) REFERENCES xbee(id_xbee),
    FOREIGN KEY(nivel) REFERENCES riesgo(nivel)
);

-- * <---------- PostgreSQL ---------->
CREATE TABLE nivel (
    id_nivel SERIAL PRIMARY KEY,
    id_xbee INTEGER NOT NULL,
    nivel INTEGER NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(id_xbee) REFERENCES xbee(id_xbee),
    FOREIGN KEY(nivel) REFERENCES riesgo(nivel)
);