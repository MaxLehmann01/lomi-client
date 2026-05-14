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
    RequestConfigContext,
    RequestHeader,
    RequestPathParam,
    RequestQueryParam,
} from '@renderer/src/modules/Request/Types';
import HttpMethod from '@renderer/src/enums/HttpMethod';
import {
    arePathParamsEqual,
    areQueryParamsEqual,
    buildRawUrlFromBaseAndQueryParameters,
    parseQueryParamsFromRawUrl,
    syncPathParamsWithBaseUrl,
} from '@renderer/src/modules/Request/Utils';

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
            pathParams: [],
            queryParams: [],
            headers: [],
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
    const [headers, setHeaders] = useState<RequestHeader[]>(fallback.headers);

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
            headers,
            setHeaders,
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
            headers,
            setHeaders,
        ]
    );

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

const Context = createContext<RequestConfigContext | undefined>(undefined);
