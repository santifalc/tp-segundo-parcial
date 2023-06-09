const db = require("../models");
const mesas = db.mesa;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
  // Validate request
  console.log(req.body);
  if (
    !req.body.nombre ||
    !req.body.planta ||
    !req.body.capacidad ||
    !req.body.restauranteId
  ) {
    res.status(400).send({
      message: "Debe completar los campos!",
    });
    return;
  }

  const { nombre, planta, capacidad, restauranteId, x, y } = req.body;

  const request = {
    nombre,
    planta,
    capacidad,
    restauranteId,
  };
  const posicionRequest = {
    x,
    y,
  };
  db.posicion.create(posicionRequest).then((posicion) => {
    request.posicionId = posicion.id;

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
    positionX: req.body.x,
    positionY: req.body.y,
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

exports.findOne = (req, res) => {
  //Validate request
  if (!req.params.id) {
    res.status(400).send({
      message: "Debe seleccionar una mesa!",
    });
    return;
  }

  const id = req.params.id;

  mesas
    .findOne({ where: { id } })
    .then((data) => {
      if (data) res.send(data);
      else throw err;
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al obtener mesa con id=" + id,
      });
    });
};

exports.findAllByRestaurant = (req, res) => {
  // Validate request
  if (!req.params.restauranteId) {
    res.status(400).send({
      message: "Debe seleccionar un restaurante!",
    });
    return;
  }

  const restauranteId = req.params.restauranteId;

  mesas;
  sequelize
    .query(
      `
          SELECT "mesa"."id", "mesa"."nombre",
          "mesa"."planta",
          "mesa"."capacidad",
          "mesa"."createdAt",
          "mesa"."updatedAt",
          "mesa"."restauranteId",
          "mesa"."posicionId",
          "mesa"."ocupado",
          "posicion"."x", "posicion"."y"
          FROM "mesas" AS "mesa"
                   JOIN "posicion_mesas" AS "posicion" ON "mesa"."posicionId" = "posicion"."id"
          WHERE "mesa"."restauranteId" = :restauranteId
      `,
      {
        replacements: { restauranteId },
        type: sequelize.QueryTypes.SELECT,
      }
    )
    .then((data) => {
      if (data.length > 0) {
        res.send(data);
      } else {
        res.status(404).send({
          message:
            "No se han encontrado mesas para el restaurante con ID " +
            restauranteId,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Error al obtener mesas del restaurante con ID " + restauranteId,
        error: err.message,
      });
    });
};
