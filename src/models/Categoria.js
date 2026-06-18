// models/Categoria.js
import { DataTypes } from 'sequelize';
import sequelize from "../config/db.js";

const Categoria = sequelize.define('Categoria', {
    idCategoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_categoria'
    },
    nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
    }
}, {
    tableName: 'categorias',
    timestamps: false
});

export default Categoria;
