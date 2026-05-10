import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import ApiRequestIpcHandler from '@main/modules/Api/IpcHandlers/Request';
import { getOrCreateDeviceIdentity } from '@main/modules/DeviceIdentity/DeviceIdentity';

app.whenReady().then(async () => {
    await getOrCreateDeviceIdentity();

    ipcMain.handle('api:request', ApiRequestIpcHandler);

    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, '../preload/index.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    if (process.env.ELECTRON_RENDERER_URL) {
        await mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
    } else {
        await mainWindow.loadFile(
            path.join(__dirname, '../renderer/index.html')
        );
    }
});
