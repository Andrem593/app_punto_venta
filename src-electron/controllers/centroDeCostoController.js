const { db } = require("../connections/db");

class centroDeCostoController {
  async index(searchString) {
    try {
      let costCenter = await db("centro_de_costo")
        .select("*")
        .where(function () {
          if (searchString) {
            this.where("nombre", "like", `%${searchString}%`);
          }
        })
        .andWhere("estado", 1)
        .orderBy("nombre", "asc")
        .limit(50);
      return costCenter;
    } catch (error) {
      console.error("Error fetching costCenter:", error);
      throw error;
    }
  }
}

module.exports = new centroDeCostoController();
