import { IpcAxiosRequestConfig, IpcAxiosResponse, IpcAxiosResult } from '../shared/types/Api';
import { Device } from '../main/modules/DeviceIdentity/Types';
import { Keypair } from '../shared/types/DeviceIdentity';

declare global {
    interface Window {
        api: {
            request: <T = unknown>(
                requestConfig: IpcAxiosRequestConfig,
            ) => Promise<IpcAxiosResult<T>>
        };
        deviceIdentity: {
            getDevice: () => Promise<Device>,
            getPublicKey: () => Promise<Keypair['publicKey']>,
        }
    }
}

export {};