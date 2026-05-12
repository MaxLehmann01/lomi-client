import { IpcAxiosRequestConfig, IpcAxiosResponse, IpcAxiosResult } from "@shared/Types/Api";
import { Keypair, Device, EncryptedAccountKeyForDevice } from "@shared/Types/DeviceIdentity";
import { EncryptedAccountKey, LocalEncryptedAccountKeyRecord, EncryptedPayload } from "@shared/Types/AccountEncryption";

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
      encryptPayload: (
          payload: unknown,
          accountKeyBase64: string
      ) => Promise<EncryptedPayload>;

      decryptPayload: <T = unknown>(
          encryptedPayload: EncryptedPayload,
          accountKeyBase64: string
      ) => Promise<T>;
    }
  }
}

export {};