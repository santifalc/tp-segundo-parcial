const consumoCabecera = require("../controllers/consumoCabeceraDAO.controller.js");
module.exports = (app) => {
  const consumoCabecera = require("../controllers/consumoCabeceraDAO.controller.js");
  var router = require("express").Router();
  router.post("/", consumoCabecera.create);
  app.use("/api/consumo", router);
};
