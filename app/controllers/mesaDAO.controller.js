const db = require("../models");
const mesas = db.mesa;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nombre) {
    res.status(400).send({
      message: "Debe enviar el nombre de la mesa!",
    });
    return;
  }

  const request = {
    nombre: req.body.nombre,
    planta: req.body.planta,
    capacidad: req.body.capacidad,
    restauranteId: req.body.restauranteId,
  };
  // Guardamos a la base de datos
  mesas
    .create(request)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ha ocurrido un error al crear una mesa.",
      });
    });
};

exports.update = (req, res) => {
  // Validate request
  if (!req.params.id) {
    res.status(400).send({
      message: "Debe seleccionar una mesa!",
    });
    return;
  }
  const id = req.params.id;

  const request = {
    nombre: req.body.nombre,
    planta: req.body.planta,
    capacidad: req.body.capacidad,
    restauranteId: req.body.restauranteId,
  };

  mesas
    .update(request, { where: { id } })
    .then((numRowsAffected) => {
      if (numRowsAffected == 1) {
        res.send({
          message: "Mesa actualizada correctamente.",
        });
      } else {
        res.status(404).send({
          message: `No se pudo actualizar la mesa con id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error al actualizar la mesa con id=${id}.`,
      });
    });
};

// Delete a Mesa by ID
exports.eliminar = (req, res) => {
  // Validate request
  if (!req.params.id) {
    res.status(400).send({
      message: "Debe seleccionar una mesa!",
    });
    return;
  }

  const id = req.params.id;

  mesas
    .destroy({ where: { id } })
    .then((numRowsAffected) => {
      if (numRowsAffected == 1) {
        res.send({
          message: "Mesa eliminada correctamente.",
        });
      } else {
        res.status(404).send({
          message: `No se pudo eliminar la mesa con id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error al eliminar la mesa con id=${id}.`,
      });
    });
};
