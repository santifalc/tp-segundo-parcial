module.exports = (sequelize, Sequelize) => {
    const Restaurante = sequelize.define("restaurante", {
        id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: Sequelize.STRING
        },
        direccion: {
            type: Sequelize.STRING
        }
    });

    return Restaurante;
};
