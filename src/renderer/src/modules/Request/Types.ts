import { Dispatch, SetStateAction } from 'react';
import HttpMethod from '@renderer/src/enums/HttpMethod';
import { IpcAxiosRequestConfig } from '@shared/Types/Api';

export type RequestConfigContext = {
    rawUrl: string;
    setRawUrl: Dispatch<SetStateAction<string>>;
    method: HttpMethod;
    setMethod: Dispatch<SetStateAction<HttpMethod>>;
    pathParams: RequestPathParam[];
    setPathParams: Dispatch<SetStateAction<RequestPathParam[]>>;
    queryParams: RequestQueryParam[];
    setQueryParams: Dispatch<SetStateAction<RequestQueryParam[]>>;
    authorization: RequestAuthorization;
    setAuthorization: Dispatch<SetStateAction<RequestAuthorization>>;
    cookies: RequestCookie[];
    setCookies: Dispatch<SetStateAction<RequestCookie[]>>;
    headers: RequestHeader[];
    setHeaders: Dispatch<SetStateAction<RequestHeader[]>>;
    body: RequestBody;
    setBody: Dispatch<SetStateAction<RequestBody>>;
    requestConfig: IpcAxiosRequestConfig;
};

export type RequestPathParam = {
    key: string;
    value: string;
};

export type RequestQueryParam = {
    isEnabled: boolean;
    key: string;
    value: string;
};

export type RequestAuthorizationBasicValue = {
    username: string;
    password: string;
};

export type RequestAuthorization =
    | { type: ''; value: null }
    | { type: 'Basic'; value: RequestAuthorizationBasicValue };

export type RequestCookie = {
    isEnabled: boolean;
    key: string;
    value: string;
};

export type RequestHeader = {
    isEnabled: boolean;
    key: string;
    value: string;
};

export type RequestBody =
    | {
          type: '';
      }
    | {
          type: 'text';
          content: string;
      };
