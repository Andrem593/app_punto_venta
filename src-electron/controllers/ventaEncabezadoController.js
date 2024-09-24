const { db, cloudDb } = require("../connections/db");

const productController = require("./productoController");

class VentaEncabezadoController {
  async store(request) {
    //Camviar
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
          subtotal: request.subtotal,
          total: request.total,
          saldo_actual: request.saldo_actual,
          fecha: request.fecha,
          centro_costo_id: request.centro_costo_id,
          subcategoria_id: request.subcategoria_id,
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
      client.subcategoria_id = request.subcategoria_id;
      client.centro_costo_id = request.centro_costo_id;
      await trx("clientes").where("id", client.id).update({
        valor: client.valor,
        subcategoria_id: client.subcategoria_id,
        centro_costo_id: client.centro_costo_id,
      });

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

  async sendToCloudSale() {
    let trx = await cloudDb.transaction();
    let localDb = await db.transaction();
    try {
      let orders = await localDb("ventas_encabezados")
        .where("replicado", 0)
        .orderBy("id");

      for (let detail of orders) {
        //Registros creados en el local
        let insertedId;

        let result = await trx("ventas_encabezados").insert({
          user_id: detail.user_id,
          cliente_id: detail.cliente_id,
          saldo: detail.saldo,
          iva: detail.iva,
          subtotal: detail.subtotal,
          total: detail.total,
          saldo_actual: detail.saldo_actual,
          fecha: detail.fecha,
          estado: detail.estado,
          created_at: detail.created_at,
          updated_at: detail.updated_at,
          centro_costo_id: detail.centro_costo_id,
          subcategoria_id: detail.subcategoria_id,
        });

        insertedId = result[0]; // Asigna el ID insertado

        let pedidosDetalles = await localDb("ventas_detalles").where(
          "venta_encabezado_id",
          detail.id
        );

        for (let detailPed of pedidosDetalles) {
          await trx("ventas_detalles").insert({
            venta_encabezado_id: insertedId,
            producto_id: detailPed.producto_id,
            cantidad: detailPed.cantidad,
            precio: detailPed.precio,
            total: detailPed.total,
            estado: detailPed.estado,
            created_at: detailPed.created_at,
            updated_at: detailPed.updated_at,
          });
          await localDb("ventas_detalles").where("id", detailPed.id).update({
            replicado: 1,
          });
        }

        await trx("clientes").where("id", detail.cliente_id).update({
          valor: detail.saldo,
          centro_costo_id: detail.centro_costo_id,
          subcategoria_id: detail.subcategoria_id,
        });

        await localDb("ventas_encabezados").where("id", detail.id).update({
          replicado: 1,
        });
      }

      await trx.commit();
      await localDb.commit();

      return {
        data: {
          success: true,
          status: 200,
          message: "Detalle del pedido eliminado y stock actualizado",
        },
      };
    } catch (error) {
      await trx.rollback();
      await localDb.rollback();
      return {
        data: {
          success: false,
          message: error,
          status: 500, // 409 Conflict
        },
      };
    }
  }
}

module.exports = new VentaEncabezadoController();
