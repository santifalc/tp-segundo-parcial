const db = require("../models");
const productos = db.productos;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
// Validate request
    if (!req.body.nombre || !req.body.categoriaId || !req.body.precio) {
        res.status(400).send({
            message: "Debe completar todos los datos!"
        });
        return;
    }

    const request = {
        nombre: req.body.nombre,
        categoriaId: req.body.categoriaId,
        precio: req.body.precio
    };
// Guardamos a la base de datos
    productos.create(request)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear el producto."
            });
        });
};

exports.findAll = (req, res) => {
    productos.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los productos."
            });
        });
};

exports.update = (req, res) => {
    // Validate request
    if (!req.params.id) {
        res.status(400).send({
            message: "Debe seleccionar un producto!",
        });
        return;
    }
    const id = req.params.id;

    const request = {
        nombre: req.body.nombre,
        categoriaId: req.body.categoriaId,
        precio: req.body.precio
    };

    productos
        .update(request, {where: {id}})
        .then((numRowsAffected) => {
            if (numRowsAffected == 1) {
                res.send({
                    message: "Producto actualizado correctamente.",
                });
            } else {
                res.status(404).send({
                    message: `No se pudo actualizar el producto con id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: `Error al actualizar el producto con id=${id}.`,
            });
        });
};

exports.eliminar = (req, res) => {
    // Validate request
    if (!req.params.id) {
        res.status(400).send({
            message: "Debe seleccionar un producto!",
        });
        return;
    }

    const id = req.params.id;

    productos
        .destroy({ where: { id } })
        .then((numRowsAffected) => {
            if (numRowsAffected == 1) {
                res.send({
                    message: "Producto eliminado correctamente.",
                });
            } else {
                res.status(404).send({
                    message: `No se pudo eliminar el producto con id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: `Error al eliminar el producto con id=${id}.`,
            });
        });
};
