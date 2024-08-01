// ipcHandlers.js
const path = require("path");
const { ipcMain, app, BrowserWindow } = require("electron");
const knex = require("knex");

let db;

// Inicializar la base de datos
function initializeDatabase() {
  const dbPath = path.join(app.getPath("userData"), "database.sqlite");

  cloudDB = knex({
    client: "pg", // o el cliente que estés usando
    connection: {
      host: "svp-database.coch3tw5gsdu.us-east-2.rds.amazonaws.com",
      user: "postgres",
      password: "Ecu12345",
      database: "SVTECHNOLOGY_PRUEBAS",
    },
    searchPath: ["rrhh"],
  });

  db = knex({
    client: "sqlite3",
    connection: {
      filename: dbPath,
    },
    useNullAsDefault: true,
  });
  // Crear tabla de usuarios si no existe
  db.schema.hasTable("users").then((exists) => {
    if (!exists) {
      return db.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("name");
        table.string("email");
        table.string("password");
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
        table.timestamps(true, true); // Agrega created_at y updated_at con valores por defecto
        table.timestamp("deleted_at"); // Agrega deleted_at
      });
    }
  });
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
        table.timestamps(true, true); // Agrega created_at y updated_at con valores por defecto
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
        table.date("fecha");
        table.integer("estado").defaultTo(1);
        table.timestamps(true, true); // Agrega created_at y updated_at con valores por defecto
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
        table.integer("estado").defaultTo(1);
        table.timestamps(true, true); // Agrega created_at y updated_at con valores por defecto
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
        table.date("fecha");
        table.integer("estado").defaultTo(1);
        table.timestamps(true, true); // Agrega created_at y updated_at con valores por defecto
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
        table.integer("estado").defaultTo(1);
        table.timestamps(true, true); // Agrega created_at y updated_at con valores por defecto
        table.timestamp("deleted_at"); // Agrega deleted_at
      });
    }
  });
}

async function replicateClientes() {
  try {
    // Obtener todos los registros de la tabla 'clientes' de la base de datos en la nube
    const clientes = await cloudDB.select("*").from("rrhh.pruebas");
    console.log("ss");

    // Insertar o actualizar registros en la base de datos local
    for (const cliente of clientes) {
      const { id, nombre, edad, ...otherFields } = cliente;

      // Verificar si el cliente ya existe en la base de datos local
      const existingCliente = await localDB("pruebas").where("id", id).first();

      if (existingCliente) {
        // Actualizar cliente existente
        await localDB("pruebas")
          .where("id", id)
          .update({
            nombre,
            edad,
            ...otherFields,
          });
      } else {
        // Insertar nuevo cliente
        await localDB("pruebas").insert({
          id,
          nombre,
          edad,
          ...otherFields,
        });
      }
    }
    console.log("Replication complete.");
  } catch (error) {
    console.error("Error replicating data:", error);
  } finally {
    // Cerrar las conexiones de base de datos
    await cloudDB.destroy();
    await localDB.destroy();
  }
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

module.exports = {
  initializeDatabase,
  registerHandlers,
  printReceipt,
  replicateClientes,
};
