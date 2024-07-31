import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import os from "os";

const { initializeDatabase, registerHandlers } = require("./ipcHandlers");

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

let mainWindow;
let db;

ipcMain.on("print-receipt", (event, receiptContent) => {
  const printWindow = new BrowserWindow({
    width: 300, // Ancho de 80 mm (80 mm ≈ 300 px a 96 DPI)
    height: 600, // Altura ajustable según el contenido
    show: false,
  });

  printWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURI(receiptContent)}`
  );
  printWindow.webContents.on("did-finish-load", () => {
    printWindow.webContents.print({ silent: true }, (success, errorType) => {
      if (!success) console.log(errorType);
      printWindow.close();
    });
  });
});

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  initializeDatabase();
  registerHandlers();
  createWindow();
});

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

export default db;
