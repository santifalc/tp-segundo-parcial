module.exports = (sequelize, Sequelize) => {
    const Categorias = sequelize.define("categorias", {
        id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: Sequelize.STRING
        }
    });
    return Categorias;
};
