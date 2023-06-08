module.exports = (sequelize, Sequelize) => {
  const ConsumoCabecera = sequelize.define("consumo_cabecera", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    estado: {
      type: Sequelize.STRING,
    },
    fechaHoraCreacion: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    fechaHoraCierre: {
      type: Sequelize.DATE,
    },
    total: {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    },
  });
  return ConsumoCabecera;
};
