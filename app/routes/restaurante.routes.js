module.exports = app => {

    const rest = require("../controllers/restauranteDAO.controller.js");
    var router = require("express").Router();
    router.post("/", rest.create);
    router.get("/", rest.findAll);
    router.put("/:id", rest.update);
    router.delete("/:id", rest.eliminar);
    app.use('/api/restaurante', router);
};
