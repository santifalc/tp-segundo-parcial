const db = require("../models");
const reservas = db.reserva;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
exports.create = (req, res) => {
  // Validate request
  if (!req.body.clienteCedula) {
    res.status(400).send({
      message: "Debe enviar el nombre del restaurante!",
    });
    return;
  }

  const request = {
    restauranteId: req.body.restauranteId,
    mesaId: req.body.mesaId,
    clienteCedula: req.body.clienteCedula,
    fecha: req.body.fecha,
    rangoHora: req.body.rangoHora,
    cantidadSolicitada: req.body.cantidadSolicitada,
  };
  // Guardamos a la base de datos
  reservas
    .create(request)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ha ocurrido un error al crear una venta.",
      });
    });
};

exports.findAll = (req, res) => {
  reservas
    .findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ocurrio un error al obtener los reservas.",
      });
    });
};

exports.findAllByRestaurante = (req, res) => {
  if (!req.body.restauranteId) {
    res.status(400).send({
      message: "Debe seleccionar un restaurante!",
    });
    return;
  }

  const restauranteId = req.body.restauranteId;

  reservas
    .findAll({
      where: { restauranteId },
      order: [
        ["clienteCedula", "ASC"],
        ["mesaId", "ASC"],
      ],
    })
    .then((data) => {
      if (data.length > 0) {
        res.send(data);
      } else {
        res.status(404).send({
          message:
            "No se han encontrado reservas para el restaurante con ID " +
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

exports.findAllByFecha = (req, res) => {
  if (!req.body.fecha) {
    res.status(400).send({
      message: "Debe seleccionar una fecha!",
    });
    return;
  }

  const fecha = req.body.fecha;

  reservas
    .findAll({
      where: { fecha },
      order: [
        ["clienteCedula", "ASC"],
        ["mesaId", "ASC"],
      ],
    })
    .then((data) => {
      if (data.length > 0) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "No se han encontrado reservas con fecha " + fecha,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al obtener reservas con fecha " + fecha,
        error: err.message,
      });
    });
};

exports.findAllByCliente = (req, res) => {
  if (!req.body.clienteCedula) {
    res.status(400).send({
      message: "Debe seleccionar una fecha!",
    });
    return;
  }

  const clienteCedula = req.body.clienteCedula;

  reservas
    .findAll({
      where: { clienteCedula },
      order: [
        ["clienteCedula", "ASC"],
        ["mesaId", "ASC"],
      ],
    })
    .then((data) => {
      if (data.length > 0) {
        res.send(data);
      } else {
        res.status(404).send({
          message:
            "No se han encontrado reservas del cliente con CI " + clienteCedula,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Error al obtener reservas del cliente con CI " + clienteCedula,
        error: err.message,
      });
    });
};
exports.create = (req, res) => {
  // Validate request
  if (!req.body.clienteId) {
    res.status(400).send({
      message: "Debe enviar el nombre del restaurante!",
    });
    return;
  }

  const request = {
    restauranteId: req.body.restauranteId,
    mesaId: req.body.mesaId,
    clienteId: req.body.clienteId,
    fecha: req.body.fecha,
    rangoHora: req.body.rangoHora,
    cantidadSolicitada: req.body.cantidadSolicitada,
  };

  reservas
    .create(request)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ha ocurrido un error al crear una venta.",
      });
    });
};

exports.mesasDisponibles = (req, res) => {
  const { restauranteId, fecha, rangoHora } = req.body;
  if (!restauranteId || !fecha || !rangoHora) return;

  //por cada hora reservada
  const queryCondicion = rangoHora
    .map((rangoHoras, index) => `"reserva"."rangoHora" = :rangoHora${index}`)
    .join(" OR ");

  const queryParams = rangoHora.reduce((acc, rangoHoras, index) => {
    acc[`rangoHora${index}`] = rangoHoras;
    return acc;
  }, {});

  sequelize
    .query(
      `
        SELECT "mesa"."id","mesa"."nombre", "posicion"."x", "posicion"."y", "mesa"."capacidad"
        FROM "mesas" AS "mesa"
        JOIN "posicion_mesas" AS "posicion" ON "mesa"."posicionId"= "posicion"."id"
        WHERE "mesa"."restauranteId" = :restauranteId 
        AND "mesa"."id" NOT IN(
            SELECT "reserva"."mesaId"
            FROM "reservas" as "reserva"
            WHERE "reserva"."fecha"= :fecha     
            AND (${queryCondicion}));
      `,
      {
        replacements: { ...queryParams, restauranteId, fecha, rangoHora },
        type: sequelize.QueryTypes.SELECT,
      }
    )
    .then((mesas) => {
      console.log(mesas);
      res.send(mesas);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ha ocurrido un error al crear una venta.",
      });
    });
};
