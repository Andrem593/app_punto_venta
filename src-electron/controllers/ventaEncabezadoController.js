const { db } = require("../connections/db");

const productController = require("./productoController");

class VentaEncabezadoController {
  async store(request) {
    //Camviar
    request.user_id = 1;
    request.fecha = new Date().toISOString().split("T")[0];

    const trx = await db.transaction();

    try {
      let orderHeader = null;

      if (request.id) {
        orderHeader = await trx("pedido_encabezados")
          .where("id", request.id)
          .first();
      } else {
        orderHeader = await trx("pedido_encabezados")
          .where("cliente_id", request.cliente_id)
          .andWhere("estado", 1)
          .first();

        if (orderHeader) {
          for (let detail of request.productos) {
            const orderDetailAmount = await trx("pedido_detalles")
              .where("pedido_encabezado_id", orderHeader.id)
              .andWhere("producto_id", detail.producto_id)
              .andWhere("estado", 1)
              .sum("cantidad");
            const newAmount =
              parseFloat(detail.cantidad) - parseFloat(orderDetailAmount);

            await productController.changeProductStockValue(
              detail.producto_id,
              newAmount,
              2
            );
          }

          await trx.commit();

          return {
            success: false,
            message:
              "La solicitud no puede ser procesada porque ya existe un pedido guardado de ese cliente.",
            status: 409, // 409 Conflict
          };
        }
      }

      // Crear el encabezado de venta
      const saleHeader = await trx("venta_encabezados").insert(
        {
          ...request,
        },
        ["id"]
      )[0];

      // Crear los detalles de la venta
      for (let detail of request.productos) {
        await trx("venta_detalles").insert({
          ...detail,
          venta_encabezado_id: saleHeader.id,
        });
      }

      const client = await trx("clientes")
        .where("id", request.cliente_id)
        .first();
      if (!client) {
        throw new Error("Cliente no encontrado");
      }

      // Verificar si tiene un pedido reservado
      if (request.id) {
        orderHeader.estado = 2;
        await trx("pedido_encabezados")
          .where("id", orderHeader.id)
          .update({ estado: orderHeader.estado });
      }

      client.valor = request.saldo;
      await trx("clientes")
        .where("id", client.id)
        .update({ valor: client.valor });

      await trx.commit();

      return {
        success: true,
        message: "Transacción realizada con éxito.",
      };
    } catch (error) {
      await trx.rollback();

      return {
        success: false,
        message: "Lo sentimos, algo ha ido mal, inténtelo de nuevo más tarde.",
        error: error.message,
        status: 500, // 500 Internal Server Error
      };
    }
  }
}

module.exports = new VentaEncabezadoController();
