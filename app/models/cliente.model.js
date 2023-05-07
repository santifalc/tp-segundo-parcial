module.exports = (sequelize, Sequelize) => {
    const Cliente = sequelize.define("cliente", {
        id: {
            type: Sequelize.BIGINT,
            autoIncrement: true
        },
        cedula: {
            type: Sequelize.BIGINT,
            primaryKey: true
        },
        nombre: {
            type: Sequelize.STRING
        },
        apellido: {
            type: Sequelize.STRING
        }
    });

    return Cliente;
};
