module.exports = (sequelize, Sequelize) => {
    const ConsumoCabecera = sequelize.define("consumo_cabecera", {
        id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        estado: {
            type: Sequelize.STRING
        },
        fechaHoraCreacion: {
            type: Sequelize.DATEONLY
        },
        fechaHoraCierre: {
            type: Sequelize.DATEONLY
        },
        total: {
            type: Sequelize.BIGINT
        }
    });
    return ConsumoCabecera;
};
