// models/Etiqueta.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Etiquetas = sequelize.define('Etiqueta', {
    idEtiqueta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_etiqueta'
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'etiquetas',
    timestamps: false
});

export default Etiqueta;
