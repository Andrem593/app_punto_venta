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

ipcMain.handle("getGlobalVariable", async (event, args) => {
  console.log("Variable Global: ", online);
  return online;
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
    console.log("En linea");
    await replicateAllData(); // Espera a que termine la replicación
    await new Promise((resolve) => setTimeout(resolve, 30000)); // Espera 30 segundos
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
  console.log("Aplicación lista.");
  //Solo envia cuando cambia a true
  // await startSendToCloudOrder();
  console.log("veamos");
  await startReplicationCycle();
  console.log("Si");
  // Otras configuraciones de Electron

  // Ejecutar la replicación cada 5 minutos

  //SE DEBE EJECUTAR EL REPLICADO CADA
  setInterval(async () => {
    if (online === true) {
      //Esto ver si lo muevo
      // await replicateData();
      // await sendToCloudOrder();
      // await sendToCloudSale();
      // await sendStockMovementsProducts();
      // await getCloudOrders();
    }
  }, 300000); // 300000 ms = 5 minutos  5000

  setInterval(async () => {
    // getCloudOrders();
  }, 300000);

  //Replicar al cloud
  setInterval(async () => {
    // if (online === true) {
    //   sendToCloudOrder();
    //   sendToCloudSale();
    // }
    // sendToCloudOrder();
  }, 300000);

  //repplicar Venta
  setInterval(async () => {
    // replicateData();
    // sendStockMovementsProducts();
    console.log("Prueba");
  }, 5000);

  // También puedes ejecutar la replicación inmediatamente al inicio
});

export default db;
