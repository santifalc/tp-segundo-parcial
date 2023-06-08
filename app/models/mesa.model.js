module.exports = (sequelize, Sequelize) => {
  const Mesa = sequelize.define("mesa", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: Sequelize.STRING,
    },
    planta: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    capacidad: {
      type: Sequelize.BIGINT,
    },
    ocupado: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return Mesa;
};
