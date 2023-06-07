const db = require("../models");
const consumos = db.consumoCabecera;
const reserva = db.reserva;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
exports.create = async (req, res) => {
  const id = req.body.reservaId;
  if (!id) {
    res.status(400).send({
      message: "Debe seleccionar una reserva!",
    });
    return;
  }

  try {
    const datos_reserva = await reserva.findOne({ where: { id } });
    if (!datos_reserva) {
      return res.status(404).send({
        message: "Reserva no encontrada con id=" + id,
      });
    }

    const request = {
      reservaId: id,
      clienteConsumoCedula: datos_reserva.dataValues.clienteCedula,
      estado: "activo",
    };

    const datos_consumo_cabecera = await consumos.create(request);

    if (datos_consumo_cabecera) {
      res.send(datos_consumo_cabecera);
    } else {
      throw new Error("Error al crear el consumo.");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "Error al obtener o crear el consumo.",
    });
  }
};
