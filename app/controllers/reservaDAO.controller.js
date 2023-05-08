const db = require("../models");
const reservas = db.reserva;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
// Validate request
    if (!req.body.clienteId) {
        res.status(400).send({
            message: "Debe enviar el nombre del restaurante!"
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
