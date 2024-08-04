const { db } = require("../connections/db");

class ProductController {
  async getProducts(searchString) {
    try {
      const products = await db("productos")
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
      console.log(product);
      return product;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async changeProductStockValue(idProduct, amount, type) {
    try {
      let product = await db("productos")
        .select("*")
        .where("id", idProduct)
        .first();

      if (product) {
        let stock =
          parseInt(type) == 1
            ? parseInt(product.stock) - parseInt(amount)
            : parseInt(product.stock) + parseInt(amount);

        await db("productos").where("id", idProduct).update({
          stock,
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }
}

module.exports = new ProductController();
