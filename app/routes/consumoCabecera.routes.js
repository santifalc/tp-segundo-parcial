const consumoCabecera = require("../controllers/consumoCabeceraDAO.controller.js");
module.exports = (app) => {
  const consumoCabecera = require("../controllers/consumoCabeceraDAO.controller.js");
  var router = require("express").Router();
  router.post("/crear/", consumoCabecera.create);
  router.post("/obtener/", consumoCabecera.obtenerConsumo);
  router.put("/cambiarCliente/:id", consumoCabecera.cambiarCliente);
  router.put("/cerrar/:id", consumoCabecera.cerrarConsumo);
  app.use("/api/consumo", router);
};
