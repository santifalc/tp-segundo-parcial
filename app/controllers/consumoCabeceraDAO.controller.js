const db = require("../models");
const PDFDocument = require("pdfkit");
const { datosDetalleConsumo } = require("./detalleConsumoDAO.controller");
const consumos = db.consumoCabecera;
const reserva = db.reserva;
const mesa = db.mesa;
const cliente = db.cliente;
const restaurante = db.restaurante;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
exports.create = async (req, res) => {
  const { mesaId, restauranteConsumoId, clienteConsumoCedula } = req.body;
  if (!mesaId || !restauranteConsumoId || !clienteConsumoCedula) {
    res.status(400).send({
      message:
        "Para abrir un consumo debe seleccionar una mesa, restaurante y cliente!",
    });
    return;
  }

  try {
    const datos_mesa = await mesa.findOne({
      where: { id: mesaId, restauranteId: restauranteConsumoId },
    });

    if (!datos_mesa) {
      throw new Error("Mesa no encontrada");
    }
    const datos_cliente = await cliente.findOne({
      where: { cedula: clienteConsumoCedula },
    });

    if (!datos_cliente) {
      throw new Error("Cliente no encontrado");
    }
    const ocupado = true;
    db.mesa.update({ ocupado }, { where: { id: mesaId } });

    const request = {
      mesaId,
      restauranteConsumoId,
      clienteConsumoCedula: datos_cliente.dataValues.cedula,
      estado: "abierto",
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

exports.cambiarCliente = async (req, res) => {
  const { clienteConsumoCedula } = req.body;
  const id = req.params.id;

  if (!clienteConsumoCedula) {
    res.status(400).send({
      message: "Para cambiar un consumo, se requiere el CI del nuevo cliente.",
    });
    return;
  }

  try {
    const numRowsAffected = await consumos.update(
      { clienteConsumoCedula },
      { where: { id } }
    );

    if (numRowsAffected == 1) {
      res.send({
        message: "Cabecera actualizada correctamente.",
      });
    } else {
      throw new Error("No se pudo actualizar la cabecera");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: `Error al actualizar la cabecera con id=${id}.`,
    });
  }
};

exports.cerrarConsumo = async (req, res) => {
  const id = req.params.id;
  const estado = "cerrado";
  const fechaHoraCierre = new Date().toLocaleString();

  try {
    const numRowsAffected = await consumos.update(
      { estado, fechaHoraCierre },
      { where: { id } }
    );

    if (numRowsAffected == 1) {
      const { fechaHoraCreacion, fechaHoraCierre, clienteConsumoCedula } =
        await this.datosConsumoCabecera(id);

      const datos_cliente = await db.cliente.findOne({
        where: { cedula: clienteConsumoCedula },
      });

      const datos_detalles = await datosDetalleConsumo(id);

      const totalPromises = datos_detalles.map(async (detalle) => {
        const productoId = detalle.productoId;
        const producto = await db.productos.findOne({
          where: { id: productoId },
        });
        const precio = producto.precio;
        return detalle.cantidad * precio;
      });

      const precios = await Promise.all(totalPromises);
      const total = precios.reduce((acc, precio) => acc + precio, 0);

      await consumos.update({ total }, { where: { id } });

      if (datos_cliente && datos_detalles && total) {
        const datos_consumo = {};
        datos_consumo.cabecera = {
          id,
          fechaHoraCreacion,
          fechaHoraCierre,
        };
        datos_consumo.cliente = {
          cedula: datos_cliente.cedula,
          nombre: datos_cliente.nombre,
          apellido: datos_cliente.apellido,
        };
        datos_consumo.detalles = datos_detalles.map((detalle) => ({
          productoId: detalle.productoId,
          cantidad: detalle.cantidad,
        }));
        datos_consumo.total = total;

        /*const pdf = generarPDF(datos_consumo, res);
        res.setHeader("Content-Type", "application/pdf");
        pdf.pipe(res);
        pdf.end();*/

        return res.send(datos_consumo);
      } else {
        throw new Error("No hay datos suficientes");
      }
    } else {
      throw new Error("No se encontró la cabecera");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "Error al cerrar el consumo.",
    });
  }
};

exports.datosConsumoCabecera = async (consumo_cabecera_id) => {
  if (!consumo_cabecera_id) {
    return;
  }
  const datos_consumo_cabecera = await consumos.findOne({
    where: { id: consumo_cabecera_id },
  });
  return datos_consumo_cabecera;
};

function generarPDF(datos_consumo, res) {
  const { cabecera, cliente, detalles, total } = datos_consumo;

  const pdf = new PDFDocument();

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=ticket${cabecera.id}.pdf`
  );
  res.setHeader("Content-Type", "application/pdf");

  pdf.pipe(res);

  pdf.text(`Nombre: ${cliente.nombre} ${cliente.apellido}`);
  pdf.text(`CI: ${cliente.cedula}`);
  pdf.text(`Fecha de creación: ${cabecera.fechaHoraCreacion}`);
  pdf.text(`Fecha de cierre: ${cabecera.fechaHoraCierre}`);
  pdf.text("Detalles:");
  detalles.forEach((detalle) => {
    pdf.text(
      `- Producto ID: ${detalle.productoId}, Cantidad: ${detalle.cantidad}`
    );
  });
  pdf.text(`Total: ${total}`, { align: "right" });

  pdf.end();

  return pdf;
}

exports.obtenerConsumo = async (req, res) => {
  const mesaId = req.body.mesaId;
  const data = {};
  const datos_mesa = await db.mesa.findOne({ where: { id: mesaId } });
  if (datos_mesa.ocupado) {
    const datos_consumo_cabecera = await consumos.findOne({
      where: { mesaId, estado: "abierto" },
    });

    data.detalles = await datosDetalleConsumo(
      datos_consumo_cabecera.dataValues.id
    );

    data.cabecera = datos_consumo_cabecera;

    return res.send(data);
  } else {
    return;
  }
};
