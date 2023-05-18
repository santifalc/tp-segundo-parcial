module.exports = (app) => {
  const reserva = require("../controllers/reservaDAO.controller.js");
  var router = require("express").Router();
  router.post("/", reserva.create);
  router.get("/", reserva.findAll);
  router.post("/filtro-restaurante", reserva.findAllByRestaurante);
  router.post("/filtro-fecha", reserva.findAllByFecha);
  router.post("/filtro-cliente", reserva.findAllByCliente);
  router.post("/mesasDis", reserva.mesasDisponibles);
  // router.get("/:id", mesa.findOne);
  app.use("/api/reserva", router);
};
