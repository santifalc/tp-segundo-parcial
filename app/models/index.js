const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    port: dbConfig.PORT,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Ventas = require("./venta.model.js")(sequelize, Sequelize);
//Se agregan los modelos
db.cliente = require('./cliente.model')(sequelize, Sequelize);
db.restaurante = require('./restaurante.model')(sequelize, Sequelize);
db.mesa = require('./mesa.model')(sequelize, Sequelize);
db.posicion = require('./posicion.model')(sequelize, Sequelize);

//Se agregan las relaciones necesarias para la base de datos
db.restaurante.hasMany(db.mesa, { as: 'mesas' });
// db.mesa.hasOne(db.posicion, { as: 'posicion' });

//Se agregan las claves foráneas a las tablas
// db.mesa.belongsTo(db.restaurante, { foreignKey: 'idRestaurante' });
// db.posicion.belongsTo(db.mesa, { foreignKey: 'idPosicion' });
module.exports = db;
