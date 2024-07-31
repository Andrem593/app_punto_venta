// ipcHandlers.js
const path = require("path");
const { ipcMain, app, BrowserWindow } = require("electron");
const knex = require("knex");

let db;

// Inicializar la base de datos
function initializeDatabase() {
  const dbPath = path.join(app.getPath("userData"), "database.sqlite");

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
}

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
};
