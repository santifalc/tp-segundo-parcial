const db = require("../models");
const readline = require("readline");
const {where} = require("sequelize");
const restaurantes = db.restaurante;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
// Validate request
    if (!req.body.nombre || !req.body.direccion) {
        res.status(400).send({
            message: "Debe completar todos los datos!"
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

exports.findAll = (req, res) => {
    restaurantes.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los restaurantes."
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
        direccion: req.body.direccion,
    };

    restaurantes
        .update(request, {where: {id}})
        .then((numRowsAffected) => {
            if (numRowsAffected == 1) {
                res.send({
                    message: "Restaurante actualizado correctamente.",
                });
            } else {
                res.status(404).send({
                    message: `No se pudo actualizar el restaurante con id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: `Error al actualizar el restaurante con id=${id}.`,
            });
        });
};

exports.eliminar = (req, res) => {
    // Validate request
    if (!req.params.id) {
        res.status(400).send({
            message: "Debe seleccionar un restaurante!",
        });
        return;
    }

    const id = req.params.id;

    restaurantes
        .destroy({ where: { id } })
        .then((numRowsAffected) => {
            if (numRowsAffected == 1) {
                res.send({
                    message: "Restaurante eliminado correctamente.",
                });
            } else {
                res.status(404).send({
                    message: `No se pudo eliminar el restaurante con id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: `Error al eliminar el restaurante con id=${id}.`,
            });
        });
};
