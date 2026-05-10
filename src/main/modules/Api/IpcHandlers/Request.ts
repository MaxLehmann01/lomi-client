import { IpcMainInvokeEvent } from 'electron';
import { IpcAxiosRequestConfig, IpcAxiosResult } from '@shared/Types/Api';
import axios from 'axios';

export default async function ApiRequestIpcHandler(
    _: IpcMainInvokeEvent,
    requestConfig: IpcAxiosRequestConfig
): Promise<IpcAxiosResult> {
    const response = await axios.request({
        method: requestConfig.method,
        url: requestConfig.url,
        baseURL: requestConfig.baseURL,
        headers: requestConfig.headers,
        params: requestConfig.params,
        data: requestConfig.data,
        timeout: requestConfig.timeout,
        responseType: requestConfig.responseType,
    });

    return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
    };
}
