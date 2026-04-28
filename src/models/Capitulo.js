// models/Capitulo.js
import { DataTypes } from 'sequelize';
import sequelize from "../config/db.js";

const Capitulo = sequelize.define('Capitulo', {
    idCapitulo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_capitulo'
    },
    titulo: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    contenido: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    }
}, {
    tableName: 'capitulos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default Capitulo;
