module.exports = (sequelize, Sequelize) => {
    const DetalleConsumo = sequelize.define("detalle_consumo", {
        id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        cantidad: {
            type: Sequelize.BIGINT
        }
    });
    return DetalleConsumo;
};
