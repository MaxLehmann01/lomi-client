import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import {
    RequestConfigContext,
    RequestHeader,
} from '@renderer/src/modules/Request/Types';
import HttpMethod from '@renderer/src/enums/HttpMethod';

export function useRequestConfig() {
    const context = useContext(Context);

    if (!context) {
        throw new Error(
            'useRequestConfig must be used within an RequestConfigProvider'
        );
    }

    return context;
}

export function RequestConfigProvider({ children }: { children: ReactNode }) {
    const fallback = useMemo(
        () => ({
            method: HttpMethod.GET,
            rawUrl: '',
            headers: [],
        }),
        []
    );

    const [method, setMethod] = useState<HttpMethod>(fallback.method);
    const [rawUrl, setRawUrl] = useState<string>(fallback.rawUrl);
    const [headers, setHeaders] = useState<RequestHeader[]>(fallback.headers);

    const contextValue = useMemo(
        () => ({
            rawUrl,
            setRawUrl,
            method,
            setMethod,
            headers,
            setHeaders,
        }),
        [rawUrl, setRawUrl, method, setMethod, headers, setHeaders]
    );

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

const Context = createContext<RequestConfigContext | undefined>(undefined);
