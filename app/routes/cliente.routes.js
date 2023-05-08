module.exports = app => {

    const cliente = require("../controllers/clienteDAO.controller.js");
    var router = require("express").Router();
    router.post("/", cliente.create);
    // router.get("/", mesa.findAll);
    // router.get("/:id", mesa.findOne);
    app.use('/api/cliente', router);
};
