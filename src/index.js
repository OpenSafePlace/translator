const
  { app, BrowserWindow, Menu, nativeTheme, ipcMain } = require('electron'),
  { spawn } = require("child_process"),
  path = require('path'),
  isMac = process.platform === 'darwin',
  darkBackgroundColor = '#3c3c3c',
  lightBackgroundColor = '#ffffff',
  iconPath = __dirname + '/source/images/icons/main.png';

if (process.platform == 'darwin')
  app.dock.setIcon(iconPath);

const init = () => {
  const mainWindow = new BrowserWindow({
    minWidth: 350,
    minHeight: 550,
    width: 600,
    height: 550,
    webPreferences: {
      devTools: true,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, "preload.js")
    },
    frame: true,
    backgroundColor: nativeTheme.shouldUseDarkColors
      ? darkBackgroundColor
      : lightBackgroundColor
  });

  mainWindow.setIcon(iconPath);
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  Menu.setApplicationMenu(Menu.buildFromTemplate(
    [
      ...(isMac ? [{
        label: app.name,
        submenu: [
          { type: 'separator' },
          { role: 'hide', label: 'Скрыть' },
          { role: 'unhide', label: 'Показать' },
          { type: 'separator' },
          { role: 'quit', label: 'Закрыть' }
        ]
      }] : []),
      {
        label: "Активность",
        submenu: [
          { label: "Вернуть", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          { label: "Повторить", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
          { type: "separator" },
          { label: "Вырезать", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Скопировать", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Вставить", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "Выбрать все", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]
      },
      {
        label: 'Страница',
        submenu: [
          { role: 'reload', label: 'Обновить' },
          { role: 'toggleDevTools', accelerator: "F12", label: 'Режим разработчика' },
          { type: 'separator' },
          { role: 'resetZoom', label: 'Масштабирование 0' },
          { role: 'zoomIn', label: 'Масштабирование +' },
          { role: 'zoomOut', label: 'Масштабирование -' },
          { type: 'separator' },
          { role: 'togglefullscreen', label: 'Изменить размер' }
        ]
      },
      {
        label: 'Окно',
        submenu: [
          { label: 'Новое', click: init },
          { role: 'zoom', label: 'Размер' },
          { type: 'separator' },
          { role: 'minimize', label: 'Скрыть' },
          { role: 'close', label: 'Закрыть' }
        ]
      }
    ]
  ));

  nativeTheme.on('updated', () => {
    if (process.platform == 'darwin')
      app.dock.setIcon(iconPath);

    mainWindow.setBackgroundColor(nativeTheme.shouldUseDarkColors
      ? darkBackgroundColor
      : lightBackgroundColor);
  });
};

app.on('ready', init);

app.on('window-all-closed',
  () => {
    if (process.platform !== 'darwin')
      app.quit();
  });

ipcMain.handle('text-translate', async (event, data) => {
    return await new Promise((resolve) => {
      spawn('python3', [path.join(__dirname, "source/scripts/py/translate.py"), "text-translate", data.langFrom, data.langTo, data.text]).stdout.on('data', (data) => resolve(data.toString()));
    });
  });
