module.exports = app => {

    const rest = require("../controllers/restauranteDAO.controller.js");
    var router = require("express").Router();
    router.post("/", rest.create);
    // router.get("/", rest.findAll);
    // router.get("/:id", rest.findOne);
    app.use('/api/restaurante', router);
};
