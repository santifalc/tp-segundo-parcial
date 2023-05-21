const db = require("../models");
const clientes = db.cliente;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
// Validate request
    if (!req.body.cedula) {
        res.status(400).send({
            message: "Debe enviar el nombre del cliente!"
        });
        return;
    }

    const request = {
        cedula: req.body.cedula,
        nombre: req.body.nombre,
        apellido: req.body.apellido
    };
// Guardamos a la base de datos
    clientes.create(request)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear un cliente."
            });
        });
};

exports.findAll = (req, res) => {
    clientes.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los clientes."
            });
        });
};
