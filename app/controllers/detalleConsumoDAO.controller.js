const db = require("../models");
const detalles = db.detalleConsumo;
const producto = db.productos;
const consumo_cabecera = db.consumoCabecera;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
  const { productoId, cantidad, consumoCabeceraId } = req.body;
  if (!productoId || !cantidad || !consumoCabeceraId) {
    res.status(400).send({
      message: "Debe completar los campos!",
    });
    return;
  }
  try {
    const datos_producto = await producto.findOne({
      where: { id: productoId },
    });

    if (!datos_producto) {
      throw new Error("Producto no encontrado");
    }

    const datos_consumo_cabecera = await consumo_cabecera.findOne({
      where: { id: consumoCabeceraId },
    });

    if (!datos_consumo_cabecera) {
      throw new Error("Consumo de reserva no encontrada");
    }

    const request = {
      cantidad,
      productoId,
      consumoCabeceraId,
    };

    const datos_detalle_consumo = await detalles.create(request);

    const producto_dato = await db.productos.findOne({
      where: { id: productoId },
    });
    let precio = Number(producto_dato.precio);
    let precio_total = Number(cantidad * precio);

    const cabecera = await db.consumoCabecera.findOne({
      where: { id: consumoCabeceraId },
    });
    console.log(precio, cantidad, precio_total, cabecera);
    const total = Number(cabecera.dataValues.total) + Number(precio_total);

    await db.consumoCabecera.update(
      { total },
      { where: { id: datos_consumo_cabecera.dataValues.id } }
    );

    res.send(datos_detalle_consumo);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "Error al obtener o crear el detalle.",
    });
  }
};

exports.findAllByConsumo = async (req, res) => {
  const consumo_cabecera_id = req.params.consumoCabeceraId;
  try {
    const datos_consumo_cabecera = await this.datosConsumoCabecera(
      consumo_cabecera_id
    );
    if (!datos_consumo_cabecera) {
      return res.status(404).send({
        message: "Consumo no encontrado con id=" + consumo_cabecera_id,
      });
    }
    const datos = { datos_consumo_cabecera };

    datos.datos_detalle_consumo = await this.datosDetalleConsumo(
      consumo_cabecera_id
    );

    res.send(datos);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "Error al obtener detalles.",
    });
  }
};

exports.datosDetalleConsumo = async (consumo_cabecera_id) => {
  const datos_detalle_consumo = await detalles.findAll({
    where: { consumoCabeceraId: consumo_cabecera_id },
  });

  return datos_detalle_consumo;
};

exports.datosConsumoCabecera = async (consumo_cabecera_id) => {
  if (!consumo_cabecera_id) {
    return;
  }
  const datos_consumo_cabecera = await db.consumoCabecera.findOne({
    where: { id: consumo_cabecera_id },
  });
  return datos_consumo_cabecera;
};
