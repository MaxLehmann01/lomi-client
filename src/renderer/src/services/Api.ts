import { IpcAxiosRequestConfig, IpcAxiosResult } from '@shared/Types/Api';

type IpcAxiosResultWithData<T> = Omit<IpcAxiosResult, 'data'> & {
    data: T;
};

export async function apiRequest<T = unknown>(
    requestConfig: IpcAxiosRequestConfig
): Promise<IpcAxiosResultWithData<T>> {
    return (await window.api.request(
        requestConfig
    )) as IpcAxiosResultWithData<T>;
}
