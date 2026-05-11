import { IpcAxiosRequestConfig, IpcAxiosResponse, IpcAxiosResult } from "../shared/types/Api";
import { Device, EncryptedAccountKeyForDevice } from "../main/modules/DeviceIdentity/Types";
import { Keypair } from "../shared/types/DeviceIdentity";
import { EncryptedAccountKey } from "../main/modules/AccountEncryption/AccountEncryption";
import { LocalEncryptedAccountKeyRecord } from "../main/modules/AccountEncryption/LocalAccountKey";

declare global {
  interface Window {
    api: {
      request: <T = unknown>(
        requestConfig: IpcAxiosRequestConfig
      ) => Promise<IpcAxiosResult<T>>
    };
    deviceIdentity: {
      getDevice: () => Promise<Device>,
      getPublicKey: () => Promise<Keypair["publicKey"]>,
      encryptAccountKey: (accountKeyBase64: string) => Promise<EncryptedAccountKey>,
      decryptAccountKey: (encryptedAccountKeyForDevice: EncryptedAccountKeyForDevice) => Promise<string>,
    },
    accountEncryption: {
      decryptAccountKeyWithPassword: (
        password: string,
        encryptedAccountKey: EncryptedAccountKey
      ) => Promise<string>,
      saveLocalEncryptedAccountKey: (
        userId: string,
        encryptedAccountKeyForDevice: EncryptedAccountKey
      ) => Promise<void>,
      loadLocalEncryptedAccountKey: (userId: string) => Promise<LocalEncryptedAccountKeyRecord | null>,
      clearLocalEncryptedAccountKey: (userId: string) => Promise<void>,
    }
  }
}

export {};