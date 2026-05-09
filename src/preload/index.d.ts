import { IpcAxiosRequestConfig, IpcAxiosResponse, IpcAxiosResult } from '../shared/types/Api';

declare global {
    interface Window {
        api: {
            request: <T = unknown>(
                requestConfig: IpcAxiosRequestConfig,
            ) => Promise<IpcAxiosResult<T>>
        };
    }
}

export {};