import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    RequestAuthorization,
    RequestBody,
    RequestConfigContext,
    RequestCookie,
    RequestHeader,
    RequestPathParam,
    RequestQueryParam,
} from '@renderer/src/modules/Request/Types';
import HttpMethod from '@renderer/src/enums/HttpMethod';
import {
    arePathParamsEqual,
    areQueryParamsEqual,
    buildRawUrlFromBaseAndQueryParameters,
    buildRequestConfig,
    parseQueryParamsFromRawUrl,
    syncPathParamsWithBaseUrl,
} from '@renderer/src/modules/Request/Utils';
import { IpcAxiosRequestConfig } from '@shared/Types/Api';

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
            pathParams: [] as RequestPathParam[],
            queryParams: [] as RequestQueryParam[],
            authorization: {
                type: '',
                value: null,
            } as RequestAuthorization,
            cookies: [] as RequestCookie[],
            headers: [] as RequestHeader[],
            body: { type: '' } as RequestBody,
        }),
        []
    );

    const [method, setMethod] = useState<HttpMethod>(fallback.method);
    const [rawUrl, setRawUrl] = useState<string>(fallback.rawUrl);
    const [baseUrl, setBaseUrl] = useState<string>(fallback.rawUrl);
    const [pathParams, setPathParams] = useState<RequestPathParam[]>(
        fallback.pathParams
    );
    const [queryParams, setQueryParams] = useState<RequestQueryParam[]>(
        fallback.queryParams
    );
    const [authorization, setAuthorization] = useState<RequestAuthorization>(
        fallback.authorization
    );
    const [cookies, setCookies] = useState<RequestCookie[]>(fallback.cookies);
    const [headers, setHeaders] = useState<RequestHeader[]>(fallback.headers);
    const [body, setBody] = useState<RequestBody>(fallback.body);

    const lastUrlSyncSourceRef = useRef<'input' | 'state' | null>(null);

    const rawUrlFromState = useMemo(() => {
        return buildRawUrlFromBaseAndQueryParameters(baseUrl, queryParams);
    }, [baseUrl, queryParams]);

    useEffect(() => {
        if (lastUrlSyncSourceRef.current === 'state') {
            lastUrlSyncSourceRef.current = null;
            return;
        }

        const { baseUrl: nextBaseUrl, queryParams: nextQueryParams } =
            parseQueryParamsFromRawUrl(rawUrl);

        setBaseUrl((prev) => (prev === nextBaseUrl ? prev : nextBaseUrl));
        setQueryParams((prev) =>
            areQueryParamsEqual(prev, nextQueryParams) ? prev : nextQueryParams
        );

        lastUrlSyncSourceRef.current = 'input';
    }, [rawUrl]);

    useEffect(() => {
        if (lastUrlSyncSourceRef.current === 'input') {
            lastUrlSyncSourceRef.current = null;
            return;
        }

        setRawUrl((prev) => {
            if (prev === rawUrlFromState) {
                return prev;
            }

            lastUrlSyncSourceRef.current = 'state';
            return rawUrlFromState;
        });
    }, [rawUrlFromState]);

    useEffect(() => {
        setPathParams((prev) => {
            const next = syncPathParamsWithBaseUrl(baseUrl, prev);
            return arePathParamsEqual(prev, next) ? prev : next;
        });
    }, [baseUrl]);

    const requestConfig = useMemo<IpcAxiosRequestConfig>(() => {
        return buildRequestConfig(
            method,
            baseUrl,
            pathParams,
            queryParams,
            authorization,
            cookies,
            headers,
            body
        );
    }, [
        method,
        baseUrl,
        pathParams,
        queryParams,
        authorization,
        cookies,
        headers,
        body,
    ]);

    const contextValue = useMemo(
        () => ({
            rawUrl,
            setRawUrl,
            baseUrl,
            setBaseUrl,
            method,
            setMethod,
            pathParams,
            setPathParams,
            queryParams,
            setQueryParams,
            authorization,
            setAuthorization,
            cookies,
            setCookies,
            headers,
            setHeaders,
            body,
            setBody,
            requestConfig,
        }),
        [
            rawUrl,
            setRawUrl,
            method,
            setMethod,
            pathParams,
            setPathParams,
            queryParams,
            setQueryParams,
            authorization,
            setAuthorization,
            cookies,
            setCookies,
            headers,
            setHeaders,
            body,
            setBody,
            requestConfig,
        ]
    );

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

const Context = createContext<RequestConfigContext | undefined>(undefined);
