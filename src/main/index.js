import { app, BrowserWindow } from "electron";
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const isDevelopment = process.env.NODE_ENV !== "production";
const path = require("path");
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`  

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 690,
    minWidth: 900,
    minHeight: 400,
    frame: false,
    useContentSize: true,
    resizable: true,
    skipTaskbar: false,
    transparent: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webSecurity: false,
      useContentSize: true,
      navigateOnDragDrop: true,
      devTools: true,
    },
  });

  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.setMenu(null);
  require("./ipcMain.js");
 /*  if (isDevelopment) {
      // 安装vue-devtools
      let extensions = BrowserWindow.getDevToolsExtensions();
      if (!extensions["Vue.js devtools"]) {
        BrowserWindow.addDevToolsExtension(
          path.resolve(__dirname, "./vue-devtools")
        );
      }
      // 打开调试窗口
      mainWindow.webContents.openDevTools()
    } */
    //mainWindow.webContents.openDevTools();
}
app.on('ready', createWindow)
require("electron").app.on("ready", () => {
  // 新增的：安装vue-devtools
  //BrowserWindow.addDevToolsExtension(path.resolve(__dirname, "./vue-devtools"));
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
