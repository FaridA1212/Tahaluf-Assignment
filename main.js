const { app, BrowserWindow, desktopCapturer} = require('electron');
const path = require('path');
const fs = require('fs');
const {powerMonitor} = require("electron");

let win;
const createWindow = () => {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      },
    })
  
    win.loadFile('index.html');

    win.on('closed', function () {
        mainWindow = null;
    });

// To Open DevTool
    win.webContents.openDevTools();

    setInterval(()=>{
        captureScreen()
        powerMonitor.addListener('lock-screen', () => {
            captureScreen()
          });
      },5000)
  }

  // Create Electron window when application ready
  app.whenReady().then(() => {
    createWindow()
  })

  // Close application automatically when close a window
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

  function captureScreen() {
    desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 900, height: 500 } })
      .then(data => {
        if (data.length > 0) 
        {
          const source = data[0];
          const storeFileDirectory =path.join(__dirname, 'capturedscreenshot/'+new Date().getTime()+'screenshot.png');
          fs.writeFile(storeFileDirectory, source.thumbnail.toPNG(), (error) => {
            if (error) {
              return error;
            } else {
              win.webContents.send('screenshot', storeFileDirectory);
            }
          });
        }
      })
      .catch(error => {
        return error;
      });
  }

module.exports = {
    captureScreen
};

