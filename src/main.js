const electron = require('electron');
const {app, BrowserWindow} = electron;
const path = require('path');
const shortcut = require('electron-localshortcut');

let mainWindow;

app.commandLine.appendSwitch('disable-frame-rate-limit');

function createWindow () {
	const screen = electron.screen;
	const area = screen.getPrimaryDisplay().workArea;
	mainWindow = new BrowserWindow({
	width: area.width * .75,
	height: area.height * .75,
	autoHideMenuBar: true, //menu bar
    webPreferences: {
      webSecurity: false,
      allowRunningInsecureContent: false,
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js')
    },
  })

  mainWindow.loadURL('http://krunker.io/');

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

function initShortcuts() {
	const KEY_BINDS = {
		escape: {
			key: 'Esc',
			press: _ => mainWindow.webContents.send('esc')
		},
		quit: {
			key: 'Alt+F4',
			press: _ => app.quit()
		},
		refresh: {
			key: 'F5',
			press: _ => mainWindow.webContents.reloadIgnoringCache()
		},
		fullscreen: {
			key: 'F11',
			press: _ => {
				let full = !mainWindow.isFullScreen();
				mainWindow.setFullScreen(full);
			}
		},
		openDevTools: {
			key: 'F12',
			press: _ => mainWindow.webContents.openDevTools({ mode: 'undocked' }),
		}
	}
	Object.keys(KEY_BINDS).forEach(k => {
		shortcut.register(mainWindow, KEY_BINDS[k].key, () => KEY_BINDS[k].press());
	});
}
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  initShortcuts();
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
