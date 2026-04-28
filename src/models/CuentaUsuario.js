// src/models/Usuario.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Usuario = sequelize.define('CuentaUsuario', {
  idCuentaUsuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_cuenta_usuario'
  },
  username: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  clave: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  avatarUrl: {
    type: DataTypes.STRING,
    field: 'avatar_url'
  },
  portadaUrl: {
    type: DataTypes.STRING,
    field: 'portada_url'
  },
  biografia: {
    type: DataTypes.TEXT
  },
  rol: {
    type: DataTypes.ENUM('lector', 'escritor', 'admin', 'moderador'),
    defaultValue: 'lector'
  },
  estado: {
    type: DataTypes.ENUM('activa', 'suspendida', 'deshabilitada'),
    defaultValue: 'activa'
  }
}, {
  tableName: 'cuenta_usuario',
  timestamps: true,
  createdAt: 'fecha_registro',
  updatedAt: 'updated_at'
});

export default Usuario;