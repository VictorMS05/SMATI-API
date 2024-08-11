USE smati;

--* <---------- MySQL ---------->
CREATE TABLE riesgo (
    nivel TINYINT NOT NULL,
    altura VARCHAR(6) NOT NULL,
    mensaje VARCHAR(25) NOT NULL,
    indicacion VARCHAR(280) NOT NULL,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME,
    PRIMARY KEY(nivel)
);

INSERT INTO riesgo (nivel, altura, mensaje, indicacion) VALUES
(0, '0 cm', 'Sin riesgo', 'No existe algún riesgo de inundación'),
(1, '30 cm', 'Riesgo bajo', 'Identifica las rutas de evacuación hacia zonas menos peligrosas'),
(2, '60 cm', 'Riesgo moderado', 'Prepárate ante cualquier indicación de desalojo'),
(3, '90 cm', 'Riesgo alto', 'Evacua el inmueble y dirígete a zonas seguras'),
(4, '120 cm', 'Riesgo intenso', 'Dirígete a un refugio establecido por Protección Civil'),
(5, '150 cm', 'Riesgo máximo', 'Espera y sigue las indicaciones por Protección Civil');

-- * <---------- PostgreSQL ---------->
CREATE TABLE riesgo (
    nivel SMALLINT PRIMARY KEY,
    altura VARCHAR(6) NOT NULL,
    mensaje VARCHAR(25) NOT NULL,
    indicacion VARCHAR(280) NOT NULL,
    fecha_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE
);

INSERT INTO riesgo (nivel, altura, mensaje, indicacion) VALUES
(0, '0 cm', 'Sin riesgo', 'No existe algún riesgo de inundación'),
(1, '30 cm', 'Riesgo bajo', 'Identifica las rutas de evacuación hacia zonas menos peligrosas'),
(2, '60 cm', 'Riesgo moderado', 'Prepárate ante cualquier indicación de desalojo'),
(3, '90 cm', 'Riesgo alto', 'Evacua el inmueble y dirígete a zonas seguras'),
(4, '120 cm', 'Riesgo intenso', 'Dirígete a un refugio establecido por Protección Civil'),
(5, '150 cm', 'Riesgo máximo', 'Espera y sigue las indicaciones por Protección Civil');