import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import ApiRequestIpcHandler from '@main/modules/Api/IpcHandlers/Request';
import { getOrCreateDeviceIdentity } from '@main/modules/DeviceIdentity/DeviceIdentity';
import DeviceIdentityGetDeviceIpcHandler from '@main/modules/DeviceIdentity/IpcHandlers/GetDevice';
import DeviceIdentityGetPublicKeyIpcHandler from '@main/modules/DeviceIdentity/IpcHandlers/GetPublicKey';
import AccountEncryptionDecryptAccountKeyWithPasswordIpcHandler from '@main/modules/AccountEncryption/IpcHandlers/DecryptAccountKeyWithPassword';
import DeviceIdentityEncryptAccountKeyIpcHandler from '@main/modules/DeviceIdentity/IpcHandlers/EncryptAccountKey';
import DeviceIdentityDecryptAccountKeyIpcHandler from '@main/modules/DeviceIdentity/IpcHandlers/DecryptAccountKey';
import AccountEncryptionSaveLocalEncryptedAccountKeyIpcHandler from '@main/modules/AccountEncryption/IpcHandlers/SaveLocalEncryptedAccountKey';
import AccountEncryptionLoadLocalEncryptedAccountKeyIpcHandler from '@main/modules/AccountEncryption/IpcHandlers/LoadLocalEncryptedAccountKey';
import AccountEncryptionClearLocalEncryptedAccountKeyIpcHandler from '@main/modules/AccountEncryption/IpcHandlers/ClearLocalEncryptedAccountKey';

app.whenReady().then(async () => {
    await getOrCreateDeviceIdentity();

    ipcMain.handle('api:request', ApiRequestIpcHandler);

    ipcMain.handle(
        'deviceIdentity:getDevice',
        DeviceIdentityGetDeviceIpcHandler
    );
    ipcMain.handle(
        'deviceIdentity:getPublicKey',
        DeviceIdentityGetPublicKeyIpcHandler
    );
    ipcMain.handle(
        'deviceIdentity:encryptAccountKey',
        DeviceIdentityEncryptAccountKeyIpcHandler
    );
    ipcMain.handle(
        'deviceIdentity:decryptAccountKey',
        DeviceIdentityDecryptAccountKeyIpcHandler
    );

    ipcMain.handle(
        'accountEncryption:decryptAccountKeyWithPassword',
        AccountEncryptionDecryptAccountKeyWithPasswordIpcHandler
    );
    ipcMain.handle(
        'accountEncryption:saveLocalEncryptedAccountKey',
        AccountEncryptionSaveLocalEncryptedAccountKeyIpcHandler
    );

    ipcMain.handle(
        'accountEncryption:loadLocalEncryptedAccountKey',
        AccountEncryptionLoadLocalEncryptedAccountKeyIpcHandler
    );

    ipcMain.handle(
        'accountEncryption:clearLocalEncryptedAccountKey',
        AccountEncryptionClearLocalEncryptedAccountKeyIpcHandler
    );

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
