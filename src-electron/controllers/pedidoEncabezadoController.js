const { db } = require("../connections/db");

class PedidoEncabezadoController {
  async index() {
    try {
      let orderHeaders = await localDb("pedidos_encabezados as pe")
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
        .leftJoin("clientes as c", "pe.client_id", "c.id")
        .leftJoin("pedidos_detalles as od", "pe.id", "od.pedido_id")
        .leftJoin("productos as p", "od.product_id", "p.id")
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
}
module.exports = new PedidoEncabezadoController();
