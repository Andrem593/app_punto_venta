const { db } = require("../connections/db");

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

      console.log("ssgs");

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
}

module.exports = new ProductController();
