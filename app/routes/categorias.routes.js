module.exports = (app) => {
  const categoria = require("../controllers/categoriasDAO.controller");
  var router = require("express").Router();
  router.post("/", categoria.create);
  router.get("/", categoria.findAll);
  router.put("/:id", categoria.update);
  router.delete("/:id", categoria.eliminar);
  app.use("/api/categorias", router);
};
