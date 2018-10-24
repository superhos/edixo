'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import Store from 'electron-store'
import CONSTANT from '../common/constant'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, selectWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const db = new Store()

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    titleBarStyle: 'hidden',
    webPreferences: {
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createSelectWindow () {
  selectWindow = new BrowserWindow({
    height: 400,
    useContentSize: true,
    width: 300,
    resizable: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      webSecurity: false
    }
  })

  selectWindow.loadURL(`${winURL}`)
  selectWindow.webContents.openDevTools()
  selectWindow.on('closed', () => {
    selectWindow = null
  })
}

app.on('ready', () => {
  const hexoProjPath = db.get(CONSTANT.HEXO_PROJ_PATH)
  if (hexoProjPath) {
    if (!mainWindow) {
      createWindow()
    }
  } else {
    if (!selectWindow) {
      createSelectWindow()
    }
  }

  ipcMain.on('open-main', (event, data) => {
    if (!mainWindow) {
      createWindow()
      selectWindow.close()
    }
  })

  ipcMain.on('open-select', (event, data) => {
    if (!selectWindow) {
      createSelectWindow()
      mainWindow.close()
    }
  })

  ipcMain.on('close-main', (event, data) => {
    if (!mainWindow) {
      mainWindow.close()
    }
  })

  ipcMain.on('close-select', (event, data) => {
    if (!selectWindow) {
      selectWindow.close()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  const hexoProjPath = db.get(CONSTANT.HEXO_PROJ_PATH)
  if (hexoProjPath) {
    if (mainWindow === null) {
      createWindow()
    }
  } else {
    if (selectWindow === null) {
      createSelectWindow()
    }
  }
})

// ipcMain.on('open-main-window', (event, arg) => {
//   console.log('here')
//   if (mainWindow) {
//     createWindow()
//   }
// })
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
