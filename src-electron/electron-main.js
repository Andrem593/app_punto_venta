import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import os from "os";

const {
  initializeDatabase,
  registerHandlers,
  replicateData,
  getCloudOrders,
  sendToCloudOrder,
  sendToCloudSale,
  sendStockMovementsProducts,
} = require("./ipcHandlers");

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

let mainWindow;
let db;
let online = true;

global.userId = null;  // Variable global

ipcMain.handle("getGlobalVariable", async (event, args) => {
  console.log("Variable Global: ", online);
  return online;
});

ipcMain.on("authenticate-user", (event, userId) => {
  global.userId = userId;
});

ipcMain.on("print-receipt", (event, receiptContent) => {
  const printWindow = new BrowserWindow();

  printWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURI(receiptContent)}`
  );
  printWindow.webContents.on("did-finish-load", () => {
    printWindow.webContents.print(
      {
        silent: true,
        margins: {
          marginType: "none", // Sin márgenes para utilizar toda el área de impresión
        },
      },
      (success, errorType) => {
        if (!success) console.log(errorType);
        printWindow.close();
      }
    );
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

  mainWindow.maximize();

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

// Función para replicar datos
async function replicateAllData() {
  // Aquí irían tus funciones de replicación
  console.log("Iniciando replicación...");
  await replicateData();

  await sendToCloudSale();
  await sendStockMovementsProducts();
  await getCloudOrders();
  console.log("Replicación finalizada.");
}

// Función que maneja el proceso de replicación con espera
async function startReplicationCycle() {
  await sendToCloudOrder();
  while (online) {
    await replicateAllData(); // Espera a que termine la replicación
    // cada 5 segundos
    await new Promise((resolve) => setTimeout(resolve, 5000)); // 30000 Espera 30 segundos
  }
}

ipcMain.on("setGlobalVariable", (event, newValue) => {
  online = newValue;
  if (online) {
    console.log("Conexión establecida, iniciando ciclo de replicación...");
    //Solo envia cuando cambia a true
    startReplicationCycle(); // Inicia el ciclo de replicación cuando `online` se pone en `true`
  } else {
    console.log("Conexión perdida, ciclo de replicación detenido.");
  }
  // mainWindow.webContents.send('globalVariableUpdated', globalVariable);
});

app.on("ready", async () => {
  await startReplicationCycle();
});

export default db;
