let path = require("path");
let { ipcMain, app, BrowserWindow } = require("electron");
let knex = require("knex");

let dbPath = path.join(app.getPath("userData"), "database3.sqlite");

let cloudDb = knex({
  client: "mysql", // o el cliente que estés usando
  connection: {
    host: "185.212.71.204",
    user: "u401385115_solmarket",
    password: "iF5/xAfq?i38",
    database: "u401385115_despensa",
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
