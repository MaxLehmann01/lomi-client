import { contextBridge, ipcRenderer } from 'electron';
import { IpcAxiosRequestConfig, IpcAxiosResult } from '@shared/Types/Api';
import { Device, Keypair } from '@shared/Types/DeviceIdentity';

contextBridge.exposeInMainWorld('electron', {
    process: {
        versions: process.versions,
    },
});

contextBridge.exposeInMainWorld('api', {
    request: <T = unknown>(
        requestConfig: IpcAxiosRequestConfig
    ): Promise<IpcAxiosResult<T>> => {
        return ipcRenderer.invoke('api:request', requestConfig);
    },
});

contextBridge.exposeInMainWorld('deviceIdentity', {
    getDevice: (): Promise<Device> => {
        return ipcRenderer.invoke('deviceIdentity:getDevice');
    },
    getPublicKey: (): Promise<Keypair['publicKey']> => {
        return ipcRenderer.invoke('deviceIdentity:getPublicKey');
    },
});
