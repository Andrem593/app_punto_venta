const { db } = require("../connections/db");

class subcategoriaController {
  async index(searchString) {
    try {
      let costCenter = await db("subcategoria")
        .select("*")
        .where(function () {
          if (searchString) {
            this.where("nombre", "like", `%${searchString}%`);
          }
        })
        .andWhere("estado", 1)
        .orderBy("nombres", "asc")
        .limit(50);
      return costCenter;
    } catch (error) {
      console.error("Error fetching costCenter:", error);
      throw error;
    }
  }
}

module.exports = new subcategoriaController();
