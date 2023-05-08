module.exports = (app) => {
  const mesa = require("../controllers/mesaDAO.controller.js");
  var router = require("express").Router();
  router.post("/", mesa.create);
  router.put("/:id", mesa.update);
  router.delete("/:id", mesa.eliminar);
  //router.get("/", mesa.findAll);
  router.get("/:id", mesa.findOne);
  app.use("/api/mesa", router);
};
