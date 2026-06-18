// models/Cuento.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Cuentos = sequelize.define('Cuento', {
    idCuento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_cuento'
    },
    titulo: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    portadaUrl: {
        type: DataTypes.STRING,
        field: 'portada_url'
    },
    audiencia: {
        type: DataTypes.ENUM('general', 'adolescentes', 'adultos'),
        defaultValue: 'general'
    },
    idioma: {
        type: DataTypes.ENUM('es', 'en'),
        defaultValue: 'es'
    },
    derechos: {
        type: DataTypes.ENUM('todos', 'compartido', 'libre'),
        defaultValue: 'todos'
    },
    clasificacion: {
        type: DataTypes.ENUM('todo', 'maduro'),
        defaultValue: 'todo'
    },
    estado: {
        type: DataTypes.ENUM('borrador', 'progreso', 'publicado'),
        defaultValue: 'borrador'
    },
    visibilidad: {
        type: DataTypes.ENUM('privada', 'publica'),
        defaultValue: 'publica'
    },
    vistas: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'cuentos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default Cuento;
