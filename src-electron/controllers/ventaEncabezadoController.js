const { db } = require("../connections/db");

const productController = require("./productoController");

class VentaEncabezadoController {
  async store(request) {
    //Camviar
    request.user_id = 1;
    request.fecha = new Date().toISOString().split("T")[0];

    let trx = await db.transaction();

    try {
      let orderHeader = null;

      if (request.id) {
        orderHeader = await trx("pedidos_encabezados")
          .where("id", request.id)
          .first();
      } else {
        orderHeader = await trx("pedidos_encabezados")
          .where("cliente_id", request.cliente_id)
          .andWhere("estado", 1)
          .andWhere("replicado", 0)
          .first();

        if (orderHeader) {
          for (let detail of request.productos) {
            let newAmount = detail.cantidad;
            await productController.changeProductStockValue(
              detail.producto_id,
              newAmount,
              2,
              trx
            );
          }

          await trx.commit();

          return {
            data: {
              success: false,
              message:
                "La solicitud no puede ser procesada porque ya existe un pedido guardado de ese cliente.",
              status: 409, // 409 Conflict
            },
          };
        }
      }

      // Crear el encabezado de venta
      let saleHeader = await trx("ventas_encabezados").insert(
        {
          user_id: request.user_id,
          cliente_id: request.cliente_id,
          saldo: request.saldo,
          iva: request.iva,
          total: request.total,
          saldo_actual: request.saldo_actual,
          fecha: request.fecha,
        },
        ["id"]
      );

      // Crear los detalles de la venta

      let saleDetails = request.productos.map((detail) => ({
        venta_encabezado_id: saleHeader[0].id,
        producto_id: detail.producto_id,
        cantidad: detail.cantidad,
        precio: detail.precio,
        total: detail.total,
      }));

      await trx("ventas_detalles").insert(saleDetails);

      let client = await trx("clientes")
        .where("id", request.cliente_id)
        .first();
      if (!client) {
        throw new Error("Cliente no encontrado");
      }

      // Verificar si tiene un pedido reservado
      if (request.id) {
        orderHeader.estado = 2;
        await trx("pedidos_encabezados")
          .where("id", orderHeader.id)
          .update({ estado: orderHeader.estado });
      }

      if (client.valor - request.total < 0) {
        await trx.rollback();
        return {
          data: {
            success: false,
            message: "No tiene suficiente saldo el cliente.",
            status: 409, // 409 Conflict
          },
        };
      }
      client.valor = request.saldo;
      await trx("clientes")
        .where("id", client.id)
        .update({ valor: client.valor });

      await trx.commit();

      return {
        data: {
          success: true,
          message: "Transacción Realizado con éxito.",
          status: 200, // 409 Conflict
        },
      };
    } catch (error) {
      await trx.rollback();

      return {
        data: {
          success: false,
          message: error,
          status: 500, // 409 Conflict
        },
      };
    }
  }

  //AL replicar la venta devbo replicar el valor del cliente
}

module.exports = new VentaEncabezadoController();
