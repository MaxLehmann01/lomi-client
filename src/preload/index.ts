import { contextBridge, ipcRenderer } from 'electron';
import { IpcAxiosRequestConfig, IpcAxiosResult } from '@shared/Types/Api';
import {
    Device,
    EncryptedAccountKeyForDevice,
    Keypair,
} from '@shared/Types/DeviceIdentity';
import { EncryptedPayload } from '@shared/Types/AccountEncryption';

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
    encryptAccountKey: (accountKeyBase64: string) => {
        return ipcRenderer.invoke(
            'deviceIdentity:encryptAccountKey',
            accountKeyBase64
        );
    },
    decryptAccountKey: (
        encryptedAccountKeyForDevice: EncryptedAccountKeyForDevice
    ) => {
        return ipcRenderer.invoke(
            'deviceIdentity:decryptAccountKey',
            encryptedAccountKeyForDevice
        );
    },
});

contextBridge.exposeInMainWorld('accountEncryption', {
    decryptAccountKeyWithPassword: (
        password: string,
        encryptedAccountKey: unknown
    ) => {
        return ipcRenderer.invoke(
            'accountEncryption:decryptAccountKeyWithPassword',
            password,
            encryptedAccountKey
        );
    },

    saveLocalEncryptedAccountKey: (
        userId: string,
        encryptedAccountKeyForDevice: unknown
    ) => {
        return ipcRenderer.invoke(
            'accountEncryption:saveLocalEncryptedAccountKey',
            userId,
            encryptedAccountKeyForDevice
        );
    },

    loadLocalEncryptedAccountKey: () => {
        return ipcRenderer.invoke(
            'accountEncryption:loadLocalEncryptedAccountKey'
        );
    },
    clearLocalEncryptedAccountKey: () => {
        return ipcRenderer.invoke(
            'accountEncryption:clearLocalEncryptedAccountKey'
        );
    },
    encryptPayload: (payload: unknown, accountKeyBase64: string) => {
        return ipcRenderer.invoke(
            'accountEncryption:encryptPayload',
            payload,
            accountKeyBase64
        );
    },
    decryptPayload: (
        encryptedPayload: EncryptedPayload,
        accountKeyBase64: string
    ) => {
        return ipcRenderer.invoke(
            'accountEncryption:decryptPayload',
            encryptedPayload,
            accountKeyBase64
        );
    },
});
