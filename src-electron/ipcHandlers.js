// ipcHandlers.js
const path = require("path");
const { ipcMain, app, BrowserWindow } = require("electron");
const knex = require("knex");
const productController = require("./controllers/productoController");
const clientesController = require("./controllers/clientesController");
const pedidoEncabezadoController = require("./controllers/pedidoEncabezadoController");
const { db, cloudDb } = require("./connections/db");
const ventaEncabezadoController = require("./controllers/ventaEncabezadoController");
const loginController = require("./controllers/loginController");
const subcategoriaController = require("./controllers/subcategoriaController");
const centroDeCostoController = require("./controllers/centroDeCostoController");

// Inicializar la base de datos
function initializeDatabase() {
  // Crear tabla de usuarios si no existe
  db.schema.hasTable("users").then((exists) => {
    if (!exists) {
      return db.schema.createTable("users", (table) => {
        table.bigIncrements("id").unsigned().notNullable(); // BIGINT UNSIGNED AUTO_INCREMENT
        table.string("name", 255).notNullable().collate("utf8mb4_unicode_ci"); // VARCHAR(255) NOT NULL
        table
          .string("email", 255)
          .notNullable()
          .unique()
          .collate("utf8mb4_unicode_ci"); // VARCHAR(255) NOT NULL UNIQUE
        table.timestamp("email_verified_at").nullable().defaultTo(null); // TIMESTAMP NULL DEFAULT NULL
        table
          .string("password", 255)
          .notNullable()
          .collate("utf8mb4_unicode_ci"); // VARCHAR(255) NOT NULL
        table
          .string("remember_token", 100)
          .nullable()
          .defaultTo(null)
          .collate("utf8mb4_unicode_ci"); // VARCHAR(100) NULL DEFAULT NULL
        table.timestamps(true, true); // TIMESTAMP NULL DEFAULT NULL for created_at and updated_at
      });
    }
  });

  db.schema.hasTable("users").then((exists) => {
    if (exists) {
      return db.schema.table("users", (table) => {
        table.string("bodega").nullable(); // Agregar la columna 'deleted_at'
      });
    }
  });

  db.schema.hasTable("parametros").then((exists) => {
    if (!exists) {
      return db.schema.createTable("parametros", (table) => {
        table.integer("id");
        table.string("descripcion");
        table.float("valor");
        table.integer("estado");
        table.timestamp("created_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("updated_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
      });
    }
  });

  db.schema.hasTable("pruebas").then((exists) => {
    if (!exists) {
      return db.schema.createTable("pruebas", (table) => {
        table.integer("id");
        table.string("nombre");
        table.integer("edad");
      });
    }
  });

  db.schema.hasTable("clientes").then((exists) => {
    if (!exists) {
      return db.schema.createTable("clientes", (table) => {
        // table.increments("id").primary();
        table.integer("id");
        table.string("cedula");
        table.string("nombres");
        table.float("valor");
        table.integer("estado").defaultTo(1);
        table.timestamp("created_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("updated_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("deleted_at").nullable(); // Agrega deleted_at
        table.integer("centro_costo_id");
        table.integer("subcategoria_id");
        table.integer("etapa_id");
        table.string("lado");
        table.string("pabellon");
        table.string("cpl");
      });
    }
  });

  // db.schema.hasTable("clientes").then((exists) => {
  //   if (exists) {
  //     return db.schema.alterTable("clientes", function (table) {
  //       table.timestamp("created_at").nullable().alter(); // Permitir nulos en 'created_at'
  //       table.timestamp("updated_at").nullable().alter(); // Permitir nulos en 'updated_at'
  //       table.timestamp("deleted_at").nullable().alter(); // Permitir nulos en 'deleted_at'
  //     });
  //   }
  // });

  db.schema.hasTable("productos").then((exists) => {
    if (!exists) {
      return db.schema.createTable("productos", (table) => {
        // table.increments("id").primary();
        table.integer("id");
        table.string("nombre");
        table.string("descripcion");
        table.string("img");
        table.float("precio");
        table.float("stock");
        table.integer("estado").defaultTo(1);
        table.timestamp("created_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("updated_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("deleted_at"); // Agrega deleted_at
      });
    }
  });

  db.schema.hasTable("productos").then((exists) => {
    if (exists) {
      return db.schema.table("productos", (table) => {
        table.string("bodega").nullable(); // Agregar la columna 'deleted_at'
      });
    }
  });
  db.schema.hasTable("centro_de_costo").then((exists) => {
    if (!exists) {
      return db.schema.createTable("centro_de_costo", (table) => {
        // table.increments("id").primary();
        table.integer("id");
        table.string("nombre");
        table.integer("estado").defaultTo(1);
        table.timestamp("created_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("updated_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("deleted_at"); // Agrega deleted_at
      });
    }
  });
  db.schema.hasTable("subcategoria").then((exists) => {
    if (!exists) {
      return db.schema.createTable("subcategoria", (table) => {
        // table.increments("id").primary();
        table.integer("id");
        table.string("nombre");
        table.integer("estado").defaultTo(1);
        table.timestamp("created_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("updated_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("deleted_at"); // Agrega deleted_at
      });
    }
  });
  db.schema.hasTable("pedidos_encabezados").then((exists) => {
    if (!exists) {
      return db.schema.createTable("pedidos_encabezados", (table) => {
        table.increments("id").primary();
        table.integer("user_id");
        table
          .integer("cliente_id")
          .unsigned()
          .references("id")
          .inTable("clientes")
          .onDelete("SET NULL");
        table.float("saldo");
        table.float("iva");
        table.float("total");
        table.float("saldo_actual");
        table.float("subtotal");
        table.date("fecha");
        table.integer("replicado").defaultTo(0);
        table.integer("id_cloud").defaultTo(null);
        table.integer("estado").defaultTo(1);
        table.integer("centro_costo_id");
        table.integer("subcategoria_id");
        table.timestamp("created_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("updated_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("deleted_at"); // Agrega deleted_at
      });
    }
  });
  db.schema.hasTable("pedidos_detalles").then((exists) => {
    if (!exists) {
      return db.schema.createTable("pedidos_detalles", (table) => {
        table.increments("id").primary();
        table
          .integer("pedido_encabezado_id")
          .unsigned()
          .references("id")
          .inTable("pedidos_encabezados")
          .onDelete("SET NULL");
        table
          .integer("producto_id")
          .unsigned()
          .references("id")
          .inTable("productos")
          .onDelete("SET NULL");
        table.integer("cantidad");
        table.float("precio");
        table.float("total");
        table.integer("id_cloud").defaultTo(null);
        table.integer("replicado").defaultTo(0);
        table.integer("estado").defaultTo(1);
        table.timestamp("created_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("updated_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("deleted_at"); // Agrega deleted_at
      });
    }
  });
  db.schema.hasTable("ventas_encabezados").then((exists) => {
    if (!exists) {
      return db.schema.createTable("ventas_encabezados", (table) => {
        table.increments("id").primary();
        table.integer("user_id");
        table
          .integer("cliente_id")
          .unsigned()
          .references("id")
          .inTable("clientes")
          .onDelete("SET NULL");
        table.float("saldo");
        table.float("iva");
        table.float("total");
        table.float("saldo_actual");
        table.float("subtotal");
        table.date("fecha");
        table.integer("replicado").defaultTo(0);
        table.integer("estado").defaultTo(1);
        table.integer("centro_costo_id");
        table.integer("subcategoria_id");
        table.timestamp("created_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("updated_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("deleted_at"); // Agrega deleted_at
      });
    }
  });
  db.schema.hasTable("ventas_detalles").then((exists) => {
    if (!exists) {
      return db.schema.createTable("ventas_detalles", (table) => {
        table.increments("id").primary();
        table
          .integer("venta_encabezado_id")
          .unsigned()
          .references("id")
          .inTable("ventas_encabezados")
          .onDelete("SET NULL");
        table
          .integer("producto_id")
          .unsigned()
          .references("id")
          .inTable("productos")
          .onDelete("SET NULL");
        table.integer("cantidad");
        table.float("precio");
        table.float("total");
        table.integer("replicado").defaultTo(0);
        table.integer("estado").defaultTo(1);
        table.timestamp("created_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("updated_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("deleted_at"); // Agrega deleted_at
      });
    }
  });

  db.schema.hasTable("movimientos_stock").then((exists) => {
    if (!exists) {
      return db.schema.createTable("movimientos_stock", (table) => {
        table.increments("id").primary();
        table.integer("pedido_detalle_id");
        table.integer("producto_id").unsigned();
        table.integer("cantidad");
        //AGREGAR PRODUCTO; ELIMINAR PRODUCTO; DEVOLVER CLOUD PRODUCTO ; DEVOLVER LOCAL PRODUCTO;
        table.string("tipo");
        //AUEMNTAR STOCK ; DISMINUIR STOCK
        table.string("accion");
        table.integer("replicado").defaultTo(0);
        table.integer("estado").defaultTo(1);
        table.integer("centro_costo_id");
        table.integer("subcategoria_id");
        table.integer("etapa_id");
        table.string("lado");
        table.string("pabellon");
        table.string("cpl");
        table.timestamp("created_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("updated_at").defaultTo(db.raw("CURRENT_TIMESTAMP"));
        table.timestamp("deleted_at"); // Agrega deleted_at
      });
    }
  });

  // db.schema.hasTable("clientes").then((exists) => {
  //   if (exists) {
  //     return db.schema.alterTable("clientes", (table) => {
  //       table.integer("centro_costo_id");
  //       table.integer("subcategoria_id");
  //       table.integer("etapa_id");
  //       table.string("lado");
  //       table.string("pabellon");
  //       table.string("cpl");
  //     });
  //   }
  // });

  // db.schema.hasTable("ventas_encabezados").then((exists) => {
  //   if (exists) {
  //     return db.schema.alterTable("ventas_encabezados", (table) => {
  //       table.integer("centro_costo_id");
  //       table.integer("subcategoria_id");
  //     });
  //   }
  // });

  // db.schema.hasTable("pedidos_encabezados").then((exists) => {
  //   if (exists) {
  //     return db.schema.alterTable("pedidos_encabezados", (table) => {
  //       table.integer("centro_costo_id");
  //       table.integer("subcategoria_id");
  //     });
  //   }
  // });
}

// console.log("aahh");

// replicateClientes();

// Registrar manejadores IPC
function registerHandlers() {
  // Evento para obtener usuarios desde la base de datos
  ipcMain.handle("get-users", async (event, args) => {
    try {
      const users = await db.select().from("users");
      return users;
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      return [];
    }
  });

  // Evento para insertar un nuevo usuario en la base de datos
  ipcMain.handle("add-user", async (event, newUser) => {
    try {
      await db("users").insert(newUser);
      return { success: true };
    } catch (err) {
      console.error("Error al insertar usuario:", err);
      return { success: false, error: err.message };
    }
  });

  ///Productos
  ipcMain.handle("get-products", async (event, args) => {
    try {
      return await productController.getProducts(args);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      return [];
    }
  });

  ipcMain.handle("producto-show", async (event, args) => {
    try {
      return await productController.show(args);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      return {};
    }
  });

  ipcMain.handle("cambio-stock-producto", async (event, args) => {
    //ver la transaccion
    let trx = await db.transaction();
    try {
      let result = await productController.changeProductStockValue(
        args.id,
        args.cantidad,
        args.type,
        trx
      );
      await trx.commit();
      return result;
    } catch (error) {
      await trx.rollback();
      return {
        success: false,
        status: 500,
        message: error,
        error: error.message,
      };
    }
  });

  //Centro de COstos

  ipcMain.handle("get-cost-center", async (event, args) => {
    try {
      return await centroDeCostoController.index(args);
    } catch (err) {
      console.error("Error al obtener cntro de costos:", err);
      return [];
    }
  });

  //Subcategorias

  ipcMain.handle("get-subcategory", async (event, args) => {
    try {
      return await subcategoriaController.index(args);
    } catch (err) {
      console.error("Error al obtener subcategorias:", err);
      return [];
    }
  });

  //Clientes

  ipcMain.handle("get-customers", async (event, args) => {
    try {
      return await clientesController.getCustomers(args);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      return [];
    }
  });

  //Pedido Encabezado

  ipcMain.handle("pedidos-encabezados-store", async (event, args) => {
    try {
      // throw new Error("Error simulado");
      return await pedidoEncabezadoController.store(args);
    } catch (error) {
      return {
        data: {
          success: false,
          status: 500,
          message: error,
          error: error.message,
        },
      };
    }
  });

  ipcMain.handle("pedidos-encabezados-get", async (event, args) => {
    try {
      return await pedidoEncabezadoController.index();
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      return [];
    }
  });

  ipcMain.handle("pedidos-encabezados-update", async (event, args) => {
    try {
      return await pedidoEncabezadoController.update(args, args.id);
    } catch (err) {
      return {
        data: {
          success: false,
          status: 500,
          message: error,
          error: error.message,
        },
      };
    }
  });

  ipcMain.handle("pedidos-encabezados-delete", async (event, args) => {
    try {
      return await pedidoEncabezadoController.destroy(args);
    } catch (error) {
      return {
        data: {
          success: false,
          status: 500,
          message: error,
          error: error.message,
        },
      };
    }
  });

  ipcMain.handle("eliminar-pedido-detalle", async (event, args) => {
    try {
      return await pedidoEncabezadoController.deleteDetailRequested(
        args.id,
        args.producto_id,
        args.cantidad,
        2
      );
    } catch (error) {
      return {
        data: {
          success: false,
          status: 500,
          message: error,
          error: error.message,
        },
      };
    }
  });

  // ipcMain.handle("getGlobalVariable", async (event, args) => {
  //   console.log("Variable Global: ", online);
  //   return online;
  // });

  // ipcMain.on("setGlobalVariable", (event, newValue) => {
  //   online = newValue;
  //   console.log("set glab: ", online);
  // });

  //Falta Probar
  ipcMain.handle("devolver-cantidad-productos", async (event, args) => {
    try {
      return await pedidoEncabezadoController.returnQuantityToProductStock(
        args
      );
    } catch (error) {
      return {
        data: {
          success: false,
          status: 500,
          message: error,
          error: error.message,
        },
      };
    }
  });
  //Venta Encabezado Controller
  ipcMain.handle("ventas-encabezados-store", async (event, args) => {
    try {
      return await ventaEncabezadoController.store(args);
    } catch (error) {
      return {
        data: {
          success: false,
          status: 500,
          message: error,
          error: error.message,
        },
      };
    }
  });

  ipcMain.handle("registar-movimiento", async (event, args) => {
    try {
      for (let detail of args.productos) {
        console.log(detail);
        await productController.recordStockMovement(
          db,
          detail.producto_id,
          detail.cantidad,
          "DEVOLVER CLOUD PRODUCTO",
          "AUMENTAR STOCK",
          detail.id
        );
      }
      return {
        data: {
          success: true,
          message: "Stock actualizado correctamente.",
          status: 200, // 200 OK
        },
      };
    } catch (error) {
      console.log(error);
      return {
        data: {
          success: false,
          status: 500,
          message: error,
          error: error.message,
        },
      };
    }
  });

  ipcMain.handle("login", async (event, args) => {
    try {
      return await loginController.login(args.email, args.password);
    } catch (error) {
      console.log(error);
      return {
        data: {
          success: false,
          status: 500,
          message: error,
          error: error.message,
        },
      };
    }
  });

  // ipcMain.handle("replicate-data", async () => {
  //   console.log("replicado");
  //   // await replicateData();
  //   return "Replication complete";
  // });
}

function printReceipt() {
  console.log("Printing receipt...");
  const printWindow = new BrowserWindow({ show: false });
  printWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURI(receiptContent)}`
  );
  printWindow.webContents.on("did-finish-load", () => {
    printWindow.webContents.print({ silent: true }, (success, errorType) => {
      if (!success) console.log(errorType);
      printWindow.close();
    });
  });
}

async function fetchCloudData(element) {
  try {
    const data = await cloudDb.select("*").from(element);
    return data;
  } catch (error) {
    console.error("Error fetching cloud data:", error);
  }
}

async function insertLocalData(data, table) {
  try {
    // console.log(data);
    for (let index = 0; index < data.length; index++) {
      let element = data[index];
      await fetchFilteredCloudData(element, table);
      // console.log(element.);
    }

    // await db("productos").insert(data);
  } catch (error) {
    console.error("Error inserting local data:", error);
  }
}

async function fetchFilteredCloudData(element, table) {
  try {
    // console.log(element);
    let data = await db
      .select("*")
      .from(table)
      .where("id", element.id) // condición where
      // .andWhere("status", "active") // otra condición where
      // .andWhere("price", ">", 100) // otra condición where con operador
      // .andWhere("name", "like", "%phone%") // condición like
      .limit(1); // límite de registros

    let columns = await db(table).columnInfo();

    let validColumns = Object.keys(columns);

    let filteredData = Object.keys(element)
      .filter((key) => validColumns.includes(key))
      .reduce((obj, key) => {
        obj[key] = element[key];
        return obj;
      }, {});

    if (table == "productos") {
      let porcentaje = await db("parametros")
        .where("descripcion", "porcentaje")
        .andWhere("estado", 1)
        .first();

      let porc = 10;

      if (porcentaje) {
        porc = parseFloat(porcentaje.valor);
      }

      porc = porc / 100;

      element.stock = Math.floor(element.stock * porc);
    }

    if (data.length > 0) {
      let result = data[0];
      // console.log(result);
      await db(table)
        .where("id", element.id) // Condición para seleccionar el registro a actualizar
        .update(filteredData);
      // .update({
      //   nombre: element.nombre, // Actualiza el campo 'name'
      //   descripcion: element.descripcion, // Actualiza el campo 'name'
      //   img: element.img, // Actualiza el campo 'name'
      //   precio: element.precio, // Actualiza el campo 'price'
      //   stock: element.stock, // Actualiza el campo 'status'
      //   estado: element.estado, // Actualiza el campo 'status'
      // });
    } else {
      await db(table).insert(filteredData);
    }

    // console.log(data);

    // return data;
  } catch (error) {
    console.error("Error fetching cloud data:", error);
  }
}

async function replicateData() {
  //Replicacion de maestros
  let tables = [
    "parametros",
    "users",
    "clientes",
    "productos",
    "subcategoria",
    "centro_de_costo",
  ];

  for (let index = 0; index < tables.length; index++) {
    let element = tables[index];
    // console.log(element);
    let cloudData = await fetchCloudData(element);
    if (cloudData && cloudData.length > 0) {
      await insertLocalData(cloudData, element);
      // console.log("Data replicated successfully");
    } else {
      console.log("No data to replicate");
    }
  }

  // const cloudData = await fetchCloudData();
  // if (cloudData && cloudData.length > 0) {
  //   await insertLocalData(cloudData);
  //   console.log("Data replicated successfully");
  // } else {
  //   console.log("No data to replicate");
  // }
}

async function getCloudOrders() {
  await pedidoEncabezadoController.getCloudOrders();
}

async function sendToCloudOrder() {
  await pedidoEncabezadoController.sendToCloudOrder();
}

async function sendToCloudSale() {
  await ventaEncabezadoController.sendToCloudSale();
}

async function sendStockMovementsProducts() {
  await productController.sendStockMovementsProducts("DEVOLVER CLOUD PRODUCTO");
  await productController.sendStockMovementsProducts(null);
}

module.exports = {
  initializeDatabase,
  registerHandlers,
  printReceipt,
  replicateData,
  getCloudOrders,
  sendToCloudOrder,
  sendToCloudSale,
  sendStockMovementsProducts,
};
