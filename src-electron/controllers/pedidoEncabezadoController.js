const { db } = require("../connections/db");
const productController = require("./productoController");

class PedidoEncabezadoController {
  async index() {
    try {
      let orderHeaders = await db("pedidos_encabezados as pe")
        .select(
          "pe.*",
          "c.nombres as client_nombres",
          "c.cedula as client_cedula",
          "c.valor as client_valor",
          "u.name as user_name",
          "od.*",
          "p.nombre as product_nombre",
          "p.img as product_img"
        )
        .where("pe.estado", 1)
        .leftJoin("users as u", "pe.user_id", "u.id")
        .leftJoin("clientes as c", "pe.cliente_id", "c.id")
        .leftJoin("pedidos_detalles as od", "pe.id", "od.pedido_id")
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
            saldo: order.client_valor,
            total: order.total,
            subtotal_iva: 0,
            descuento: 0,
            productos: [],
          };
          acc.push(existingOrder);
        }

        if (order.product_id) {
          existingOrder.productos.push({
            ...order,
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
    const trx = await db.transaction();
    request.user_id = 1;
    request.fecha = new Date().toISOString().split("T")[0];
    try {
      let orderHeaders = await trx("pedidos_encabezados")
        .where("cliente_id", request.cliente_id)
        .where("estado", 1)
        .first();

      if (orderHeaders) {
        for (let detail of request.productos) {
          await productController.changeProductStockValue(
            detail.producto_id,
            detail.cantidad,
            2
          );

          await trx.commit();

          return {
            success: false,
            message:
              "La solicitud no puede ser procesada porque ya existe un registro de ese cliente.",
            status: 409, // 409 Conflict
          };
        }
      }

      orderHeaders = await trx("pedido_encabezados").insert(request);
      // Crear detalles del pedido
      const orderDetails = request.productos.map((detail) => ({
        ...detail,
        pedido_encabezado_id: orderHeader[0].id,
      }));

      await trx("order_details").insert(orderDetails);

      // Actualizar cliente
      let client = await trx("clientes")
        .where("id", orderHeader[0].cliente_id)
        .first();

      client.valor -= parseFloat(request.total);
      await trx("clientes").where("id", client.id).update(client);

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      console.error("Error fetching order headers:", error);
      throw error;
    }
  }

  async update(request, id) {
    const trx = await db.transaction();

    try {
      const orderHeader = await trx("pedido_encabezados")
        .where("id", id)
        .first();
      if (!orderHeader) {
        throw new Error("Pedido no encontrado");
      }
      //VCamviar el di
      request.user_id = 1;
      request.fecha = new Date().toISOString().split("T")[0];

      for (let detail of request.productos) {
        if (detail.id) {
          // Actualizar detalle existente
          await trx("pedido_detalles").where("id", detail.id).update({
            cantidad: detail.cantidad,
            precio: detail.precio,
            total: detail.total,
          });
        } else {
          // Crear nuevo detalle
          detail.pedido_encabezado_id = orderHeader.id;
          await trx("pedido_detalles").insert(detail);
        }
      }

      // Actualizar el valor del cliente
      const client = await trx("clientes")
        .where("id", orderHeader.cliente_id)
        .first();
      if (!client) {
        throw new Error("Cliente no encontrado");
      }
      const totalProductos = request.productos.reduce(
        (sum, prod) => sum + parseFloat(prod.total),
        0
      );
      client.valor =
        parseFloat(orderHeader.saldo_actual) - parseFloat(totalProductos);
      await trx("clientes")
        .where("id", client.id)
        .update({ valor: client.valor });

      // Actualizar el encabezado del pedido
      await trx("pedido_encabezados").where("id", id).update({
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

  async destroy(id) {
    const trx = await db.transaction();

    try {
      // Obtener el encabezado del pedido
      const orderHeaders = await trx("pedido_encabezados")
        .where("id", id)
        .first();
      if (!orderHeaders) {
        throw new Error("Pedido no encontrado");
      }

      // Obtener los detalles del pedido
      const ordersDetails = await trx("pedido_detalles")
        .where("pedido_encabezado_id", orderHeaders.id)
        .andWhere("estado", 1);

      let totalRecover = 0;
      for (let detail of ordersDetails) {
        // Actualizar el stock del producto
        const product = await trx("productos")
          .where("id", detail.producto_id)
          .first();
        if (!product) {
          throw new Error("Producto no encontrado");
        }
        product.stock += parseFloat(detail.cantidad);
        await trx("productos")
          .where("id", detail.producto_id)
          .update({ stock: product.stock });

        totalRecover += parseFloat(detail.total);
      }

      // Actualizar el cliente
      const client = await trx("clientes")
        .where("id", orderHeaders.cliente_id)
        .first();
      if (!client) {
        throw new Error("Cliente no encontrado");
      }
      client.valor += parseFloat(totalRecover);
      await trx("clientes")
        .where("id", client.id)
        .update({ valor: client.valor });

      // Actualizar el estado del encabezado del pedido
      await trx("pedido_encabezados")
        .where("id", orderHeaders.id)
        .update({ estado: 0 });

      // Confirmar la transacción
      await trx.commit();

      return {
        success: true,
        message: "Transacción realizada con éxito.",
      };
    } catch (error) {
      // Revertir la transacción
      await trx.rollback();

      return {
        success: false,
        message: "Lo sentimos, algo ha ido mal, inténtelo de nuevo más tarde.",
        error: error.message,
        status: 500, // 500 Internal Server Error
      };
    }
  }

  /**
   * Disminuye el stock
   * type: 1 = disminuye, otro = 2 aumenta
   */
  async returnQuantityToProductStock(request) {
    const trx = await db.transaction();

    try {
      for (let detail of request.productos) {
        let newAmount = detail.cantidad;

        if (request.id) {
          const orderDetailAmount = await trx("pedido_detalles")
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
          2
        );
      }

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
        status: 500, // 500 Internal Server Error
      };
    }
  }
}
module.exports = new PedidoEncabezadoController();
