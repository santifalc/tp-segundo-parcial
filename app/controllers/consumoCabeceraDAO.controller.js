const db = require("../models");
// const PDFDocument = require("pdfkit");
const { datosDetalleConsumo } = require("./detalleConsumoDAO.controller");
const consumos = db.consumoCabecera;
const reserva = db.reserva;
const mesa = db.mesa;
const cliente = db.cliente;
const restaurante = db.restaurante;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
const { PDFDocument, StandardFonts, rgb } = require ('pdf-lib')
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
      const {
        fechaHoraCreacion,
        fechaHoraCierre,
        clienteConsumoCedula,
        mesaId,
      } = await this.datosConsumoCabecera(id);

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

      await db.mesa.update({ ocupado: false }, { where: { id: mesaId } });
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
        let pdf = await createPdf(datos_consumo);
        const data = {
          datos_consumo: datos_consumo,
          pdf: pdf
        }

        return res.send(data);
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
  } else return res.send(null);
};

async function createPdf(datos_consumo) {
  const pdfDoc = await PDFDocument.create()
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  const fontSize = 18

  const fechaHoraCierre = new Date(datos_consumo.cabecera.fechaHoraCierre);
  const dia = fechaHoraCierre.getDate();
  const mes = fechaHoraCierre.getMonth() + 1; // Los meses en JavaScript comienzan desde 0
  const anio = fechaHoraCierre.getFullYear();
  const hora = fechaHoraCierre.getHours();
  const minutos = fechaHoraCierre.getMinutes();
  const segundos = fechaHoraCierre.getSeconds();

// Formatear los componentes en formato deseado
  const fechaHoraFormateada = `${dia < 10 ? '0' + dia : dia}-${mes < 10 ? '0' + mes : mes}-${anio} ${hora < 10 ? '0' + hora : hora}:${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;


  let detallesText = '';
  for (const detalle of datos_consumo.detalles) {
    const productoId = detalle.productoId;
    const cantidad = detalle.cantidad;
    const producto = await db.productos.findOne({
      where: { id: detalle.productoId },
    });
    detallesText += `Producto: ${productoId} - ${producto.nombre},  Cantidad: ${cantidad}\n`;
  }

  page.drawText(`\nNombre: ${datos_consumo.cliente.nombre}\n 
  Fecha: ${fechaHoraFormateada} \n
  Detalles:\n ${detallesText}\n
  Total: ${datos_consumo.total}`, {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  })

  const pdfBytes = await pdfDoc.saveAsBase64();

  return pdfBytes;
}
