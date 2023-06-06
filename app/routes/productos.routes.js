module.exports = app => {
    const producto = require("../controllers/productosDAO.controller");
    var router = require("express").Router();
    router.post("/", producto.create);
    router.get("/", producto.findAll);
    router.put("/:id", producto.update);
    router.delete("/:id", producto.eliminar);
    app.use('/api/productos', router);
};
