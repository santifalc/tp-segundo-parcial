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
    idle: dbConfig.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Ventas = require("./venta.model.js")(sequelize, Sequelize);
//Se agregan los modelos (Crear las tablas en la bd)
db.cliente = require("./cliente.model")(sequelize, Sequelize);
db.restaurante = require("./restaurante.model")(sequelize, Sequelize);
db.mesa = require("./mesa.model")(sequelize, Sequelize);
db.posicion = require("./posicion.model")(sequelize, Sequelize);
db.reserva = require("./reserva.model")(sequelize, Sequelize);

//Se agregan las relaciones necesarias para la base de datos
db.restaurante.hasMany(db.mesa, { as: "mesas" });

db.cliente.hasOne(db.reserva, { as: "cliente" });
db.restaurante.hasOne(db.reserva, { as: "restaurante" });
db.mesa.hasMany(db.reserva, { as: "mesas" });
db.posicion.hasOne(db.mesa, { as: "posicion" });

//Se agregan las claves foráneas a las tablas (no hace falta xd)
// db.mesa.belongsTo(db.restaurante, {
//   foreignKey: "restauranteId",
//   as: "restauranteAssociation",
// });
// db.posicion.belongsTo(db.mesa, {
//   foreignKey: "posicionId",
//   as: "posicionAsociacion",
// });

// db.reserva.belongsTo(db.restaurante, { foreignKey: 'restauranteId', as: 'idRestaurante' });
// db.reserva.belongsTo(db.mesa, { foreignKey: 'idMesa', as: 'idMesa' });
// db.reserva.belongsTo(db.cliente, { foreignKey: 'idCliente', as: 'idCliente' });

// Cuando se agrega una clave foranea se debe descomentar el código de abajo
// y ejecutar el node server.js
module.exports = db;
// sequelize
//   .sync({ force: true })
//   .then(() => {
//     console.log("Tablas sincronizadas.");
//   })
//   .catch((err) => {
//     console.log("Error al sincronizar tablas:", err);
//   });
