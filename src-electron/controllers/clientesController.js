const { db } = require("../connections/db");

class clientesController {
  async getCustomers(searchString) {
    try {
      let customers = await db("clientes")
        .select(
          "clientes.*",
          "centro_de_costo.nombre as centro_costo",
          "subcategoria.nombre as subcategoria"
        )
        .leftJoin(
          "centro_de_costo",
          "clientes.centro_costo_id",
          "=",
          "centro_de_costo.id"
        )
        .leftJoin(
          "subcategoria",
          "clientes.subcategoria_id",
          "=",
          "subcategoria.id"
        )
        .where(function () {
          if (searchString) {
            this.where("cedula", "like", `%${searchString}%`).orWhere(
              "nombres",
              "like",
              `%${searchString}%`
            );
          }
        })
        .andWhere("clientes.estado", 1)
        .orderBy("nombres", "asc")
        .limit(50);
      return customers;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  }
}

module.exports = new clientesController();
