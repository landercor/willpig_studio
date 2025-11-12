-- ==================================================
-- BASE DE DATOS WILLPIG_STUDIO
-- ==================================================
DROP DATABASE IF EXISTS WILLPIG_studio;
CREATE DATABASE WILLPIG_studio
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE WILLPIG_studio;

-- ==================================================
-- TABLAS BASE
-- ==================================================
CREATE TABLE Seguimiento (
  idSeguimiento INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE Usuarios (
  idUsuario INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(45) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  clave VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  biografia TEXT,
  rol ENUM('lector','admin','moderador') DEFAULT 'lector',
  estado ENUM('activa','suspendida','deshabilitada') DEFAULT 'activa',
  fecha_registro DATE NOT NULL,
  Seguimiento_id INT NOT NULL,
  CONSTRAINT fk_Usuarios_Seguimiento
    FOREIGN KEY (Seguimiento_id) REFERENCES Seguimiento(idSeguimiento)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Avatar (
  idAvatar INT AUTO_INCREMENT PRIMARY KEY,
  avatar_url VARCHAR(255) NOT NULL,
  adjuntar_img VARCHAR(255),
  Usuario_id INT NOT NULL,
  CONSTRAINT fk_Avatar_Usuarios
    FOREIGN KEY (Usuario_id) REFERENCES Usuarios(idUsuario)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Roles (
  idRol INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(100) NOT NULL,
  tipo ENUM('lector','escritor') NOT NULL,
  Usuario_id INT NOT NULL,
  CONSTRAINT fk_Roles_Usuarios
    FOREIGN KEY (Usuario_id) REFERENCES Usuarios(idUsuario)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==================================================
-- CONTENIDO PRINCIPAL
-- ==================================================
CREATE TABLE Catalogos (
  idCatalogo INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE Categorias (
  idCategoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE Cuentos (
  idCuento INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  resumen TEXT,
  url_portada VARCHAR(255),
  categoria VARCHAR(50),
  estado ENUM('borrador','progreso','publicado') DEFAULT 'borrador',
  visibilidad ENUM('privada','publica') DEFAULT 'publica',
  fecha_creada DATE NOT NULL,
  fecha_actualizada DATE NOT NULL,
  cantidad_me_gusta INT DEFAULT 0,
  Usuario_id INT NOT NULL,
  CONSTRAINT fk_Cuentos_Usuarios
    FOREIGN KEY (Usuario_id) REFERENCES Usuarios(idUsuario)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Capitulos (
  idCapitulo INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  contenido TEXT NOT NULL,
  fecha_creado DATE NOT NULL,
  fecha_actualizado DATE NOT NULL,
  Cuento_id INT NOT NULL,
  CONSTRAINT fk_Capitulo_Cuento
    FOREIGN KEY (Cuento_id) REFERENCES Cuentos(idCuento)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==================================================
-- RELACIONES Y FUNCIONALIDADES
-- ==================================================
--  TABLA RENOMBRADA DE 'Listas_guardados' a 'Biblioteca' 
CREATE TABLE Biblioteca (
  idBiblioteca INT AUTO_INCREMENT PRIMARY KEY, --  Nombre de columna actualizado
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  predeterminado BOOLEAN DEFAULT FALSE,
  fecha_agregado DATE NOT NULL,
  Usuario_id INT NOT NULL,
  CONSTRAINT fk_Biblioteca_Usuarios --  Nombre de FK actualizado
    FOREIGN KEY (Usuario_id) REFERENCES Usuarios(idUsuario)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Notificacion (
  idNotificacion INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('nuevo_seguidor','nuevo_capitulo','respuesta_comentario','actualizacion_reporte') NOT NULL,
  contenido TEXT NOT NULL,
  vista BOOLEAN DEFAULT FALSE,
  Usuario_id INT NOT NULL,
  CONSTRAINT fk_Notificacion_Usuarios
    FOREIGN KEY (Usuario_id) REFERENCES Usuarios(idUsuario)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==================================================
-- TABLAS INTERMEDIAS (N:N)
-- ==================================================
CREATE TABLE Cuentos_has_Catalogos (
  Cuento_id INT NOT NULL,
  Catalogo_id INT NOT NULL,
  PRIMARY KEY (Cuento_id, Catalogo_id),
  CONSTRAINT fk_Cuentos_Catalogos_Cuento
    FOREIGN KEY (Cuento_id) REFERENCES Cuentos(idCuento)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_Cuentos_Catalogos_Catalogo
    FOREIGN KEY (Catalogo_id) REFERENCES Catalogos(idCatalogo)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==================================================
-- DATOS DE PRUEBA
-- ==================================================
INSERT INTO Seguimiento (fecha) VALUES (CURDATE());
SET @idSeg = LAST_INSERT_ID();

INSERT INTO Usuarios (username,email,clave,fecha_registro,Seguimiento_id)
VALUES ('usuario_prueba','prueba@example.com','clave_hash',CURDATE(),@idSeg);
SET @idUser = LAST_INSERT_ID();

INSERT INTO Cuentos (titulo,resumen,fecha_creada,fecha_actualizada,Usuario_id)
VALUES ('La rana cantora','La ranita está feliz',CURDATE(),CURDATE(),@idUser);

SHOW TABLES;
-- ==================================================
-- DATOS DE PRUEBA_01
-- ==================================================
INSERT INTO Seguimiento (fecha) VALUES (CURDATE());

SET @idSeg = LAST_INSERT_ID();

INSERT INTO Usuarios (username,email,clave,fecha_registro,Seguimiento_id)
VALUES ('usuario_prueba','prueba@example.com','clave_hash',CURDATE(),@idSeg);
SET @idUser = LAST_INSERT_ID();

INSERT INTO Cuentos (titulo,resumen,fecha_creada,fecha_actualizada,Usuario_id)
VALUES ('La rana cantora','La ranita está feliz',CURDATE(),CURDATE(),@idUser);

INSERT INTO usuarios (username,email,clave,fecha_registro,Seguimiento_id)
VALUES ('lan_test','lan@example.com','clave123',CURDATE(),1);

SHOW TABLES;
-- ==================================================
-- DATOS DE PRUEBA_02
-- ==================================================
SELECT * FROM usuarios;
SELECT * FROM cuentos;
SELECT NOW();
-- ==================================================
-- FIN DEL SCRIPT
-- ===============================================