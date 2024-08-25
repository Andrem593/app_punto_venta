const { db, cloudDb } = require("../connections/db");
const productController = require("./productoController");

class PedidoEncabezadoController {
  async index() {
    try {
      let orderHeaders = await db("pedidos_encabezados as pe")
        .select(
          "pe.id",
          "pe.user_id",
          "pe.cliente_id",
          "pe.saldo",
          "pe.iva",
          "pe.total",
          "pe.subtotal",
          "pe.saldo_actual",
          "pe.fecha",
          "c.nombres as client_nombres",
          "c.cedula as client_cedula",
          "c.valor as client_valor",
          "u.name as user_name",
          "od.id as id_detalle",
          "od.pedido_encabezado_id",
          "od.producto_id",
          "od.cantidad",
          "od.precio",
          "od.total as total_detalle",
          "p.nombre as product_nombre",
          "p.img as product_img"
        )
        .where("pe.estado", 1)
        .andWhere("od.estado", 1)
        .andWhere("pe.replicado", 0)
        .leftJoin("users as u", "pe.user_id", "u.id")
        .leftJoin("clientes as c", "pe.cliente_id", "c.id")
        .leftJoin("pedidos_detalles as od", "pe.id", "od.pedido_encabezado_id")
        .leftJoin("productos as p", "od.producto_id", "p.id")
        .orderBy("pe.created_at", "desc")
        .limit(20);

      let transformedOrders = orderHeaders.reduce((acc, order) => {
        let existingOrder = acc.find((o) => o.id === order.id);
        if (!existingOrder) {
          existingOrder = {
            ...order,
            nombre_completo: order.client_nombres,
            nombres: order.client_nombres,
            cedula: order.client_cedula,
            saldo: order.saldo,
            total: order.total,
            subtotal_iva: 0,
            descuento: 0,
            productos: [],
          };
          acc.push(existingOrder);
        }

        if (order.producto_id) {
          existingOrder.productos.push({
            id: order.id_detalle,
            pedido_encabezado_id: order.pedido_encabezado_id,
            producto_id: order.producto_id,
            cantidad: order.cantidad,
            precio: order.precio,
            total: order.total_detalle,
            nombre: order.product_nombre,
            img: order.product_img,
          });
        }
        return acc;
      }, []);

      return transformedOrders;
    } catch (error) {
      console.error("Error fetching order headers:", error);
      throw error;
    }
  }

  async store(request) {
    let trx = await db.transaction();
    request.fecha = new Date().toISOString().split("T")[0];
    try {
      let orderHeaders = await trx("pedidos_encabezados")
        .where("cliente_id", request.cliente_id)
        .andWhere("replicado", 0)
        .andWhere("estado", 1)
        .first();

      if (orderHeaders) {
        for (let detail of request.productos) {
          await productController.changeProductStockValue(
            detail.producto_id,
            detail.cantidad,
            2,
            trx
          );

          await trx.commit();

          return {
            data: {
              success: false,
              message:
                "La solicitud no puede ser procesada porque ya existe un registro de ese cliente.",
              status: 409, // 409 Conflict
            },
          };
        }
      }

      orderHeaders = await trx("pedidos_encabezados").insert(
        {
          user_id: request.user_id,
          cliente_id: request.cliente_id,
          saldo: request.saldo,
          iva: request.iva,
          subtotal: request.subtotal,
          total: request.total,
          saldo_actual: request.saldo_actual,
          fecha: request.fecha,
        },
        ["id"]
      );

      let orderDetails = request.productos.map((detail) => ({
        pedido_encabezado_id: orderHeaders[0].id,
        producto_id: detail.producto_id,
        cantidad: detail.cantidad,
        precio: detail.precio,
        total: detail.total,
      }));

      await trx("pedidos_detalles").insert(orderDetails);

      await trx.commit();

      return {
        data: {
          success: true,
          status: 200,
          message: "Guardado con éxito.",
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

  async update(request, id) {
    let trx = await db.transaction();

    try {
      let orderHeader = await trx("pedidos_encabezados")
        .where("id", id)
        .first();
      if (!orderHeader) {
        throw new Error("Pedido no encontrado");
      }
      request.fecha = new Date().toISOString().split("T")[0];

      for (let detail of request.productos) {
        if (detail.id) {
          // Actualizar detalle existente
          await trx("pedidos_detalles").where("id", detail.id).update({
            cantidad: detail.cantidad,
            precio: detail.precio,
            total: detail.total,
          });
        } else {
          // Crear nuevo detalle
          detail.pedido_encabezado_id = orderHeader.id;
          await trx("pedidos_detalles").insert({
            pedido_encabezado_id: detail.pedido_encabezado_id,
            producto_id: detail.producto_id,
            cantidad: detail.cantidad,
            precio: detail.precio,
            total: detail.total,
          });
        }
      }

      // Actualizar el encabezado del pedido
      await trx("pedidos_encabezados").where("id", id).update({
        user_id: request.user_id,
        saldo_actual: request.saldo_actual,
        saldo: request.saldo,
        subtotal: request.subtotal,
        iva: request.iva,
        total: request.total,
        fecha: request.fecha,
      });

      await trx.commit();

      return {
        data: {
          success: true,
          status: 200,
          message: "Guardado con éxito.",
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

  async destroy(id) {
    let trx = await db.transaction();

    try {
      // Obtener el encabezado del pedido
      let orderHeaders = await trx("pedidos_encabezados")
        .where("id", id)
        .first();
      if (!orderHeaders) {
        throw new Error("Pedido no encontrado");
      }

      // Obtener los detalles del pedido
      let ordersDetails = await trx("pedidos_detalles")
        .where("pedido_encabezado_id", orderHeaders.id)
        .andWhere("estado", 1);

      for (let detail of ordersDetails) {
        // Actualizar el stock del producto
        let product = await trx("productos")
          .where("id", detail.producto_id)
          .first();
        if (!product) {
          throw new Error("Producto no encontrado");
        }
        product.stock += parseInt(detail.cantidad);
        await trx("productos")
          .where("id", detail.producto_id)
          .update({ stock: product.stock });

        let result = await productController.recordStockMovement(
          trx,
          detail.producto_id,
          parseInt(detail.cantidad),
          "ELIMINAR PRODUCTO",
          "AUMENTAR STOCK",
          null
        );
        if (!result.success) {
          return result;
        }
      }

      // Actualizar el estado del encabezado del pedido
      await trx("pedidos_encabezados")
        .where("id", orderHeaders.id)
        .update({ estado: 0 });

      // Confirmar la transacción
      await trx.commit();

      return {
        data: {
          success: true,
          status: 200,
          message: "Detalle del pedido eliminado y stock actualizado",
        },
      };
    } catch (error) {
      // Revertir la transacción
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

  /**
   * Disminuye el stock
   * type: 1 = disminuye, otro = 2 aumenta
   */
  async returnQuantityToProductStock(request) {
    let trx = await db.transaction();

    try {
      for (let detail of request.productos) {
        let newAmount = detail.cantidad;

        if (request.id) {
          let orderDetailAmount = await trx("pedidos_detalles")
            .where({
              pedido_encabezado_id: request.id,
              producto_id: detail.producto_id,
              estado: 1,
            })
            .sum("cantidad as total")
            .first();

          newAmount -= parseFloat(orderDetailAmount.total) || 0;
        }

        await productController.changeProductStockValue(
          trx,
          detail.producto_id,
          newAmount,
          2,
          trx
        );
      }

      await trx.commit();

      return {
        data: {
          success: true,
          status: 200,
          message: "Transaccón realizado con éxito",
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

  async deleteDetailRequested(id, idProduct, amount, type) {
    let trx = await db.transaction();

    try {
      // Buscar el detalle del pedido
      let orderDetail = await trx("pedidos_detalles").where("id", id).first();

      if (!orderDetail) {
        throw new Error("Detalle de pedido no encontrado");
      }

      // Actualizar el estado del detalle del pedido
      await trx("pedidos_detalles").where("id", id).update({
        estado: 0,
      });

      // Actualizar el stock del producto
      await productController.changeProductStockValue(
        idProduct,
        amount,
        type,
        trx
      );

      await trx.commit();
      return {
        data: {
          success: true,
          status: 200,
          message: "Detalle del pedido eliminado y stock actualizado",
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

  async sendToCloudOrder() {
    let trx = await cloudDb.transaction();
    let localDb = await db.transaction();
    try {
      let orders = await localDb("pedidos_encabezados")
        .where("replicado", 0)
        .orderBy("id");

      for (let detail of orders) {
        //Registros creados en el local
        if (detail.id_cloud === null) {
          let insertedId;

          let result = await trx("pedidos_encabezados").insert({
            user_id: detail.user_id,
            cliente_id: detail.cliente_id,
            saldo: detail.saldo,
            iva: detail.iva,
            subtotal: detail.subtotal,
            total: detail.total,
            saldo_actual: detail.saldo_actual,
            fecha: detail.fecha,
            estado: detail.estado,
          });

          insertedId = result[0]; // Asigna el ID insertado

          let pedidosDetalles = await localDb("pedidos_detalles").where(
            "pedido_encabezado_id",
            detail.id
          );

          for (let detailPed of pedidosDetalles) {
            await trx("pedidos_detalles").insert({
              pedido_encabezado_id: insertedId,
              producto_id: detailPed.producto_id,
              cantidad: detailPed.cantidad,
              precio: detailPed.precio,
              total: detailPed.total,
              estado: detailPed.estado,
            });
            await localDb("pedidos_detalles").where("id", detailPed.id).update({
              replicado: 1,
            });
          }
        } else {
          let pedidos_encabezados = await trx("pedidos_encabezados")
            .select("*")
            .where("id", detail.id_cloud)
            .andWhere("estado", 1)
            .first();

          if (pedidos_encabezados) {
            await trx("pedidos_encabezados")
              .where("id", detail.id_cloud)
              .update({
                user_id: detail.user_id,
                cliente_id: detail.cliente_id,
                saldo: detail.saldo,
                iva: detail.iva,
                total: detail.total,
                saldo_actual: detail.saldo_actual,
                fecha: detail.fecha,
                estado: detail.estado,
              });

            let pedidosDetalles = await localDb("pedidos_detalles")
              .where("pedido_encabezado_id", detail.id)
              .andWhere("replicado", 0);
            console.log(pedidosDetalles);

            for (let detailPed of pedidosDetalles) {
              if (detailPed.id_cloud === null) {
                await trx("pedidos_detalles").insert({
                  pedido_encabezado_id: detail.id_cloud,
                  producto_id: detailPed.producto_id,
                  cantidad: detailPed.cantidad,
                  precio: detailPed.precio,
                  total: detailPed.total,
                  estado: detailPed.estado,
                  created_at: detailPed.created_at,
                  updated_at: detailPed.updated_at,
                });
              } else {
                await trx("pedidos_detalles")
                  .where("id", detailPed.id_cloud)
                  .update({
                    producto_id: detailPed.producto_id,
                    cantidad: detailPed.cantidad,
                    precio: detailPed.precio,
                    total: detailPed.total,
                    estado: detailPed.estado,
                  });
              }
              await localDb("pedidos_detalles")
                .where("id", detailPed.id)
                .update({
                  replicado: 1,
                });
            }
          }
        }
        await localDb("pedidos_encabezados").where("id", detail.id).update({
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
      console.log(error);
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

  async getCloudOrders() {
    let trx = await db.transaction();
    try {
      let orderHeaderCloud = await cloudDb("pedidos_encabezados");
      //ver si se pone where
      // .where(
      //   "estado",
      //   1
      // );

      for (let order of orderHeaderCloud) {
        let orderHeaderLocal = await trx("pedidos_encabezados")
          .where("id_cloud", order.id)
          .andWhere("replicado", 0)
          .first();

        if (!orderHeaderLocal) {
          let orderLocal = await trx("pedidos_encabezados").insert(
            {
              user_id: order.user_id,
              cliente_id: order.cliente_id,
              saldo: order.saldo,
              subtotal: order.subtotal,
              iva: order.iva,
              total: order.total,
              fecha: order.fecha.toISOString().slice(0, 10),
              estado: order.estado,
              created_at: order.created_at,
              updated_at: order.updated_at,
              saldo_actual: order.saldo_actual,
              id_cloud: order.id,
            },
            ["id"]
          );

          orderLocal = orderLocal[0];

          let ordersDetailsCloud = await cloudDb("pedidos_detalles")
            .select("*")
            .where("pedido_encabezado_id", order.id);

          for (let detail of ordersDetailsCloud) {
            let detailLocal = await trx("pedidos_detalles")
              .select("*")
              .where("id_cloud", detail.id)
              .andWhere("replicado", 0)
              .first();

            if (!detailLocal) {
              await trx("pedidos_detalles").insert({
                pedido_encabezado_id: orderLocal.id,
                producto_id: detail.producto_id,
                cantidad: detail.cantidad,
                precio: detail.precio,
                total: detail.total,
                estado: detail.estado,
                created_at: detail.created_at,
                updated_at: detail.updated_at,
                id_cloud: detail.id,
              });
            }
          }
        } else {
          await trx("pedidos_encabezados")
            .where("id_cloud", order.id)
            .andWhere("replicado", 0)
            .update({
              user_id: order.user_id,
              cliente_id: order.cliente_id,
              saldo: order.saldo,
              subtotal: order.subtotal,
              iva: order.iva,
              total: order.total,
              fecha: order.fecha.toISOString().slice(0, 10),
              estado: order.estado,
              created_at: order.created_at,
              updated_at: order.updated_at,
              saldo_actual: order.saldo_actual,
            });

          let ordersDetailsCloud = await cloudDb("pedidos_detalles").where(
            "pedido_encabezado_id",
            order.id
          );

          for (let detail of ordersDetailsCloud) {
            let detailLocal = await trx("pedidos_detalles")
              .where("id_cloud", detail.id)
              .andWhere("replicado", 0)
              .first();

            if (detailLocal) {
              await trx("pedidos_detalles")
                .where("id_cloud", detail.id)
                .andWhere("replicado", 0)
                .update({
                  producto_id: detail.producto_id,
                  cantidad: detail.cantidad,
                  precio: detail.precio,
                  total: detail.total,
                  estado: detail.estado,
                  created_at: detail.created_at,
                  updated_at: detail.updated_at,
                });
            }
          }
        }
      }

      await trx.commit();
      return {
        data: {
          success: true,
          status: 200,
          message: "Detalle del pedido eliminado y stock actualizado",
        },
      };
    } catch (error) {
      await trx.rollback();
      console.log(error);
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
module.exports = new PedidoEncabezadoController();
