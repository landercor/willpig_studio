// models/Notificacion.js
import { DataTypes } from 'sequelize';
import sequelize from "../config/db.js";

const Notificacion = sequelize.define('Notificacion', {
    idNotificacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_notificacion'
    },
    tipo: {
        type: DataTypes.ENUM(
        'nuevo_seguidor',
        'nuevo_capitulo',
        'comentario',
        'actualizacion'
    ),
    allowNull: false
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    vista: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'notificaciones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

export default Notificacion;
