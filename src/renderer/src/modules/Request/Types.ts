import { Dispatch, SetStateAction } from 'react';
import HttpMethod from '@renderer/src/enums/HttpMethod';

export type RequestConfigContext = {
    rawUrl: string;
    setRawUrl: Dispatch<SetStateAction<string>>;
    method: HttpMethod;
    setMethod: Dispatch<SetStateAction<HttpMethod>>;
    headers: RequestHeader[];
    setHeaders: Dispatch<SetStateAction<RequestHeader[]>>;
};

export type RequestHeader = {
    isEnabled: boolean;
    key: string;
    value: string;
};
