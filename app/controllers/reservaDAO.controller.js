const db = require("../models");
const reservas = db.reserva;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
// Validate request
    if (!req.body.clienteCedula) {
        res.status(400).send({
            message: "Debe enviar el nombre del restaurante!"
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
    reservas.create(request)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear una venta."
            });
        });
};

exports.findAll = (req, res) => {
    reservas.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los reservas."
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
        .findAll({where: {restauranteId},
            order: [['clienteCedula', 'ASC'], ['mesaId', 'ASC']]
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
        .findAll({where: {fecha},
            order: [['clienteCedula', 'ASC'], ['mesaId', 'ASC']]
        })
        .then((data) => {
            if (data.length > 0) {
                res.send(data);
            } else {
                res.status(404).send({
                    message:
                        "No se han encontrado reservas con fecha " +
                        fecha,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    "Error al obtener reservas con fecha " + fecha,
                error: err.message,
            });
        });
};
