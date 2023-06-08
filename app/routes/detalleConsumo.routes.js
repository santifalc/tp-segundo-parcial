module.exports = (app) => {
  const detalleConsumo = require("../controllers/detalleConsumoDAO.controller.js");
  var router = require("express").Router();
  router.post("/", detalleConsumo.create);
  router.get("/consumo/:consumoCabeceraId", detalleConsumo.findAllByConsumo);
  app.use("/api/detalleC", router);
};
