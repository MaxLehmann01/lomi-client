import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type IpcAxiosRequestConfig = AxiosRequestConfig;

export type IpcAxiosResult<T = unknown> = Pick<
    AxiosResponse<T>,
    'data' | 'status' | 'statusText' | 'headers'
>;
