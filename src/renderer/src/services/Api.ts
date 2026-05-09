import { IpcAxiosRequestConfig, IpcAxiosResult } from '@shared/types/Api';

export async function apiRequest(
    requestConfig: IpcAxiosRequestConfig
): Promise<IpcAxiosResult> {
    return await window.api.request(requestConfig);
}
