const { app, BrowserWindow } = require('electron');
const path = require('node:path');

// Importamos tu servidor backend (asegúrate de que sea tu index.js)
require('./stock-motos-backend/index.js'); 

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // En producción, cargará la interfaz de React compilada
  // Si está en desarrollo, puedes usar http://localhost:5173
  const isDev = !app.isPackaged;
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173'); 
  } else {
    mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});