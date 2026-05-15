import { Dispatch, SetStateAction } from 'react';
import HttpMethod from '@renderer/src/enums/HttpMethod';

export type RequestConfigContext = {
    rawUrl: string;
    setRawUrl: Dispatch<SetStateAction<string>>;
    method: HttpMethod;
    setMethod: Dispatch<SetStateAction<HttpMethod>>;
    pathParams: RequestPathParam[];
    setPathParams: Dispatch<SetStateAction<RequestPathParam[]>>;
    queryParams: RequestQueryParam[];
    setQueryParams: Dispatch<SetStateAction<RequestQueryParam[]>>;
    cookies: RequestCookie[];
    setCookies: Dispatch<SetStateAction<RequestCookie[]>>;
    headers: RequestHeader[];
    setHeaders: Dispatch<SetStateAction<RequestHeader[]>>;
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
