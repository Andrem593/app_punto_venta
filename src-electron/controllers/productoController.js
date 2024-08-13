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

      this.recordStockMovement(db, idProduct, amount, typeMessage, action);

      return {
        success: true,
        message: "Stock actualizado correctamente.",
        status: 200, // 200 OK
      };
    } catch (error) {
      console.log("Error");
      return {
        success: false,
        message: "Lo sentimos, algo ha ido mal, inténtelo de nuevo más tarde.",
        error: error.message,
        status: 500, // 500 Internal Server Error
      };
    }
  }

  async recordStockMovement(db, producto_id, cantidad, tipo, accion) {
    try {
      //TIPO
      //AGREGAR PRODUCTO; ELIMINAR PRODUCTO; DEVOLVER C:OUD PRODUCTO ; DEVOLVER LOCAL PRODUCTO;
      //ACCION
      //AUEMNTAR STOCK ; DISMINUIR STOCK
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
      return {
        success: false,
        message: "Lo sentimos, algo ha ido mal, inténtelo de nuevo más tarde.",
        error: error.message,
        status: 500, // 500 Internal Server Error
      };
    }
  }

  //Envio los registros de a tabla
  async sendStockMovementsProducts(cloudDb, type) {
    let trx = await cloudDb.transaction();
    try {
      let movements = await db("movimientos_stock")
        .select("*")
        .where("estado", 1)
        .andWhere("replicado", 0)
        .andWhere("tipo", type)
        //ver el tipo
        .orderBy("id");

      for (let detail of movements) {
        let product = await trx("productos")
          .select("*")
          .where("id", detail.producto_id)
          .first();

        if (product) {
          //Pedidos que quedaron en el aire
          if (type == "DEVOLVER CLOUD PRODUCTO") {
            let pedidoDetalle = await trx("pedidos_detalles")
              .select("*")
              .where("id", detail.pedido_detalle_id)
              .first();

            let cantidad = 0;
            if (pedidoDetalle && pedidoDetalle.cantidad > movements.cantidad) {
              cantidad =
                parseInt(pedidoDetalle.cantidad) - parseInt(movements.cantidad);
              product.stock += cantidad;
            }
          } else {
            if (product.accion == "AUMENTAR STOCK") {
              product.stock += parseInt(detail.cantidad);
            } else if (product.accion == "DISMINUIR STOCK") {
              //SI llega a cero poner algo en el producto
              product.stock -= parseInt(detail.cantidad);
            }
          }

          try {
            let rowsAffected = cloudDb("productos")
              .where("id", product.id)
              .update({
                stock: product.stock,
              });
            if (rowsAffected) {
              await trx("movimientos_stock").where("id", detail.id).update({
                replicado: 1,
              });
            }
          } catch {
            console.log("Error");
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
