// models/index.js
import CuentaUsuario from './CuentaUsuario.js';
import Cuento from './Cuento.js';
import Categoria from './Categoria.js';
import Capitulo from './Capitulo.js';
import Etiqueta from './Etiqueta.js';
import Notificacion from './Notificacion.js';

// Usuario → Cuentos
CuentaUsuario.hasMany(Cuento, { foreignKey: 'cuenta_usuario_id' });
Cuento.belongsTo(CuentaUsuario, { foreignKey: 'cuenta_usuario_id' });

// Categoría → Cuentos
Categoria.hasMany(Cuento, { foreignKey: 'categoria_id' });
Cuento.belongsTo(Categoria, { foreignKey: 'categoria_id' });

// Cuento → Capítulos
Cuento.hasMany(Capitulo, { foreignKey: 'cuento_id' });
Capitulo.belongsTo(Cuento, { foreignKey: 'cuento_id' });

// Cuentos ↔ Etiquetas (N:N)
Cuento.belongsToMany(Etiqueta, {
    through: 'cuentos_etiquetas',
    foreignKey: 'cuento_id',
    timestamps: false
});
Etiqueta.belongsToMany(Cuento, {
    through: 'cuentos_etiquetas',
    foreignKey: 'etiqueta_id',
    timestamps: false
});

// Usuario → Notificaciones
CuentaUsuario.hasMany(Notificacion, { foreignKey: 'cuenta_usuario_id' });
Notificacion.belongsTo(CuentaUsuario, { foreignKey: 'cuenta_usuario_id' });

export {
    CuentaUsuario,
    Cuento,
    Categoria,
    Capitulo,
    Etiqueta,
    Notificacion
};
