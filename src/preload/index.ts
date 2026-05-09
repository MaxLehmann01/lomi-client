import { contextBridge, ipcRenderer } from 'electron';
import { IpcAxiosRequestConfig, IpcAxiosResult } from '@shared/types/Api';

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
