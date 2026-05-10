import { IpcAxiosRequestConfig, IpcAxiosResult } from '@shared/Types/Api';

export async function apiRequest(
    requestConfig: IpcAxiosRequestConfig
): Promise<IpcAxiosResult> {
    return await window.api.request(requestConfig);
}
