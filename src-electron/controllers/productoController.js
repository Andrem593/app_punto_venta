const { db, cloudDb } = require("../connections/db");

class ProductController {
  async getProducts(searchString) {
    try {
      let products = await db("productos")
        .select("*")
        .where(function () {
          if (searchString) {
            this.where("nombre", "like", `%${searchString}%`).orWhere(
              "descripcion",
              "like",
              `%${searchString}%`
            );
          }
        })
        .andWhere("stock", ">", 0)
        .andWhere("estado", 1)
        .orderBy("nombre", "asc")
        .limit(20);
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async show(id) {
    try {
      let product = await db("productos").select("*").where("id", id).first();
      return product;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async changeProductStockValue(idProduct, amount, type, db) {
    try {
      // Buscar el producto
      let product = await db("productos").where("id", idProduct).first();

      if (!product) {
        throw new Error("Producto no encontrado");
      }

      // Verificar el tipo de operación

      if (type == 1) {
        // Resta del stock
        if (product.stock - amount >= 0) {
          product.stock = product.stock - amount;
        } else {
          return {
            success: false,
            message: "No existe stock de este producto.",
            status: 409, // 409 Conflict
          };
        }
      } else {
        // Suma al stock
        product.stock = product.stock + amount;
      }

      // Actualizar el stock del producto en la base de datos
      await db("productos")
        .where("id", idProduct)
        .update({ stock: product.stock });

      let typeMessage = type == 1 ? "AGREGAR PRODUCTO" : "ELIMINAR PRODUCTO";
      let action = type == 1 ? "DISMINUIR STOCK" : "AUMENTAR STOCK";

      let result = await this.recordStockMovement(
        db,
        idProduct,
        amount,
        typeMessage,
        action,
        null
      );
      if (!result.success) {
        return result;
      }

      return {
        success: true,
        message: "Stock actualizado correctamente.",
        status: 200, // 200 OK
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Lo sentimos, algo ha ido mal, inténtelo de nuevo más tarde.",
        error: error.message,
        status: 500, // 500 Internal Server Error
      };
    }
  }

  async recordStockMovement(
    db,
    producto_id,
    cantidad,
    tipo,
    accion,
    pedido_detalle_id
  ) {
    try {
      //TIPO
      //AGREGAR PRODUCTO; ELIMINAR PRODUCTO; DEVOLVER C:OUD PRODUCTO ; DEVOLVER LOCAL PRODUCTO;
      //ACCION
      //AUEMNTAR STOCK ; DISMINUIR STOCK
      console.log(pedido_detalle_id, producto_id, cantidad, tipo, accion);
      await db("movimientos_stock").insert({
        pedido_detalle_id,
        producto_id,
        cantidad,
        tipo,
        accion,
      });

      return {
        success: true,
        message: "Stock actualizado correctamente.",
        status: 200, // 200 OK
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Lo sentimos, algo ha ido mal, inténtelo de nuevo más tarde.",
        error: error.message,
        status: 500, // 500 Internal Server Error
      };
    }
  }

  //Envio los registros de a tabla
  async sendStockMovementsProducts(type) {
    let trx = await cloudDb.transaction();
    let localDb = await db.transaction();
    try {
      let query = localDb("movimientos_stock")
        .where("estado", 1)
        .andWhere("replicado", 0)
        .orderBy("id");

      if (type === "DEVOLVER CLOUD PRODUCTO") {
        query = query.andWhere("tipo", type);
      } else {
        query = query.andWhere("tipo", "!=", "DEVOLVER CLOUD PRODUCTO");
      }

      let movements = await query;

      for (let detail of movements) {
        let product = await trx("productos")
          .where("id", detail.producto_id)
          .first();

        if (product) {
          //Pedidos que quedaron en el aire
          if (type == "DEVOLVER CLOUD PRODUCTO") {
            if (detail.pedido_detalle_id === null) {
              product.stock += parseInt(detail.cantidad);
            } else {
              let pedidoDetalle = await trx("pedidos_detalles")
                .where("id", detail.pedido_detalle_id)
                .first();

              let cantidad = 0;
              if (pedidoDetalle && detail.cantidad > pedidoDetalle.cantidad) {
                cantidad =
                  parseInt(detail.cantidad) - parseInt(pedidoDetalle.cantidad);
                product.stock += cantidad;
              }
            }
          } else {
            if (detail.accion === "AUMENTAR STOCK") {
              product.stock += parseInt(detail.cantidad);
            } else if (detail.accion === "DISMINUIR STOCK") {
              //SI llega a cero poner algo en el producto
              product.stock -= parseInt(detail.cantidad);
            }
          }

          await trx("productos").where("id", product.id).update({
            stock: product.stock,
          });

          await localDb("movimientos_stock").where("id", detail.id).update({
            replicado: 1,
          });
        }
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
}

module.exports = new ProductController();
