const db = require("../models");
const categorias = db.categorias;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
// Validate request
    if (!req.body.nombre) {
        res.status(400).send({
            message: "Debe completar todos los datos!"
        });
        return;
    }

    const request = {
        nombre: req.body.nombre
    };
// Guardamos a la base de datos
    categorias.create(request)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear la categoría."
            });
        });
};

exports.findAll = (req, res) => {
    categorias.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener las categorías."
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
        nombre: req.body.nombre
    };

    categorias
        .update(request, {where: {id}})
        .then((numRowsAffected) => {
            if (numRowsAffected == 1) {
                res.send({
                    message: "Categoría actualizada correctamente.",
                });
            } else {
                res.status(404).send({
                    message: `No se pudo actualizar la categoría con id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: `Error al actualizar la categoría con id=${id}.`,
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

    categorias
        .destroy({ where: { id } })
        .then((numRowsAffected) => {
            if (numRowsAffected == 1) {
                res.send({
                    message: "Categoría eliminada correctamente.",
                });
            } else {
                res.status(404).send({
                    message: `No se pudo eliminar la categoría con id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: `Error al eliminar la categoría con id=${id}.`,
            });
        });
};
