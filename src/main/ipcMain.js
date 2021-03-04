var { app, Menu, Tray, ipcMain, BrowserWindow,dialog } = require('electron')
const Store = require("electron-store");
const request = require('request');
const fs = require('fs')
const store = new Store();
let appIcon = null
var path = require('path')
// 获取当前窗口对象 BrowserWindow.getFocusedWindow();
var mainWindow = BrowserWindow.getFocusedWindow()
appIcon = new Tray(path.join(__dirname, '../../static/image/music.ico'))
const menu = Menu.buildFromTemplate([
  {
    label: '设置',
    click: function () {} // 打开相应页面
  },
  {
    label: '帮助',
    click: function () {
      
    }
  },
  {
    label: '关于',
    click: function () {
      console.log(666)
    }
  },
  {
    label: '退出',
    click: function () {
      app.quit()
    }
  }
])
appIcon.setContextMenu(menu)
// 接受渲染进程广播的数据
ipcMain.on('toMain', (event, data) => {
  console.log(data)
})

// 最小化
ipcMain.on('window-min', (e, data) => {
  mainWindow.minimize()
})

// 最大化
ipcMain.on('window-max', (e, data) => {
  if (mainWindow.isMaximized()) {
    mainWindow.restore()
  } else {
    mainWindow.maximize()
  }
})

// 关闭
ipcMain.on('window-close', (e, data) => {
  if (!mainWindow.isFocused()) {
    mainWindow = null
  } else {
    e.preventDefault()
    mainWindow.hide()
  }
  // mainWindow.close();
})

// 双击托盘，显示
appIcon.on('double-click', function () {
  mainWindow.show()
})

//下载音乐
//store.delete("savepath");
ipcMain.on("download", (evt, item) => {
  console.log('item',item)
  let pathsave = store.get("savepath");
  if (pathsave != undefined) {
    downloadFile(item.url, item.title, pathsave, function() {
      mainWindow.webContents.send("downsuccess", item);
    });
  } else {
    dialog.showOpenDialog(mainWindow, {
        properties: ["openDirectory"],
      }).then((res) => {
        store.set("savepath", res.filePaths[0]);
        downloadFile(item.url, item.title, res.filePaths[0], function() {
          mainWindow.webContents.send("downsuccess", item);
        });
      }).catch((err) => {
        console.log(err);
      });
  }
});
//下载音乐到指定目录
function downloadFile(url, filename,savepath, callback) {
  let stream = fs.createWriteStream(path.join(savepath,filename + ".mp3"));
  request(url).pipe(stream).on("close", callback);
}
ipcMain.on("dragstart", (event) => {
  event.sender.startDrag();
});