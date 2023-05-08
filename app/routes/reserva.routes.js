module.exports = app => {

    const reserva = require("../controllers/reservaDAO.controller.js");
    var router = require("express").Router();
    router.post("/", reserva.create);
    // router.get("/", mesa.findAll);
    // router.get("/:id", mesa.findOne);
    app.use('/api/reserva', router);
};
