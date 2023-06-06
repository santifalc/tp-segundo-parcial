module.exports = (sequelize, Sequelize) => {
    const Productos = sequelize.define("productos", {
        id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: Sequelize.STRING
        },
        precio: {
            type: Sequelize.BIGINT
        }
    });
    return Productos;
};
