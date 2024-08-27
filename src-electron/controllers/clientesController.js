const { db } = require("../connections/db");

class clientesController {
  async getCustomers(searchString) {
    try {
      let customers = await db("clientes")
        .select("*")
        .where(function () {
          if (searchString) {
            this.where("cedula", "like", `%${searchString}%`).orWhere(
              "nombres",
              "like",
              `%${searchString}%`
            );
          }
        })
        .andWhere("estado", 1)
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
