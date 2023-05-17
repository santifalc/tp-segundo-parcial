module.exports = (sequelize, Sequelize) => {
  const Posicion = sequelize.define("posicion_mesa", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    x: {
      type: Sequelize.STRING,
    },
    y: {
      type: Sequelize.STRING,
    },
  });

  return Posicion;
};
