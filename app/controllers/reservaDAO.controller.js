const db = require("../models");
const reservas = db.reserva;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
exports.create = (req, res) => {
    // Validate request
    if (!req.body.clienteCedula || !req.body.fecha || !req.body.restauranteId || !req.body.rangoHora ) {
        res.status(400).send({
            message: "Debe completar todos los datos!",
        });
        return;
    }

    const clienteCedula = req.body.clienteCedula;
    const fecha = req.body.fecha;
    reservas
        .findAll({
            where: {clienteCedula,
            fecha}
        })
        .then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    message:
                        "El cliente ya posee una reserva!"
                });
            } else {
                const {
                    restauranteId,
                    mesaId,
                    fecha,
                    rangoHora,
                    cantidadSolicitada
                } = req.body;

                // Iterar sobre los rangos de hora y guardamos en la bd como registros distintos
                Promise.all(
                    rangoHora.map(rango => {
                        const request = {
                            restauranteId,
                            mesaId,
                            clienteCedula,
                            fecha,
                            rangoHora: rango,
                            cantidadSolicitada
                        };
                        return reservas.create(request);
                    })
                )
                    .then(data => {
                        res.send(data);
                    })
                    .catch(err => {
                        res.status(500).send({
                            message:
                                err.message || "Ha ocurrido un error al crear una reserva."
                        });
                    });
            }
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
            where: {restauranteId},
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
            where: {fecha},
            order: [
                ["clienteCedula", "ASC"],
                ["mesaId", "ASC"],
            ],
        })
        .then((data) => {
            if (data.length > 0) {
                res.send(data);
            } else {
                res.status(200).send({
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
    console.log(req.body);
    if (!req.body.clienteCedula) {
        res.status(400).send({
            message: "Debe enviar una cédula de cliente!",
        });
        return;
    }

    const clienteCedula = req.body.clienteCedula;

    reservas
        .findAll({
            where: {clienteCedula},
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

exports.mesasDisponibles = (req, res) => {
    const {restauranteId, fecha, rangoHora} = req.body;
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
                SELECT "mesa"."id", "mesa"."nombre", "posicion"."x", "posicion"."y", "mesa"."capacidad"
                FROM "mesas" AS "mesa"
                         JOIN "posicion_mesas" AS "posicion" ON "mesa"."posicionId" = "posicion"."id"
                WHERE "mesa"."restauranteId" = :restauranteId
                  AND "mesa"."id" NOT IN (SELECT "reserva"."mesaId"
                                          FROM "reservas" as "reserva"
                                          WHERE "reserva"."fecha" = :fecha
                                            AND (${queryCondicion}));
            `,
            {
                replacements: {...queryParams, restauranteId, fecha, rangoHora},
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
