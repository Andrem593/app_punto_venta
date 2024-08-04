let path = require("path");
let { ipcMain, app, BrowserWindow } = require("electron");
let knex = require("knex");

let dbPath = path.join(app.getPath("userData"), "database.sqlite");

let cloudDb = knex({
  client: "mysql", // o el cliente que estés usando
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: null,
    database: "despensa_app",
  },
});

let db = knex({
  client: "sqlite3",
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
});

module.exports = { cloudDb, db };
