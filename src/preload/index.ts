import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    process: {
        versions: process.versions,
    },
});
