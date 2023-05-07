const db = require("../models");
const restaurantes = db.restaurante;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
// Validate request
    if (!req.body.nombre) {
        res.status(400).send({
            message: "Debe enviar el nombre del restaurante!"
        });
        return;
    }

    const request = {
        nombre: req.body.nombre,
        direccion: req.body.direccion,
    };
// Guardamos a la base de datos
    restaurantes.create(request)
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
