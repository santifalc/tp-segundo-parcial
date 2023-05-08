module.exports = (sequelize, Sequelize) => {
    const Reserva = sequelize.define("reserva", {
        id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        fecha: {
            type: Sequelize.DATEONLY
        },
        rangoHora: {
            type: Sequelize.STRING,
            defaultValue: 1
        },
        cantidadSolicitada: {
            type: Sequelize.INTEGER
        }
    });

    return Reserva;
};
