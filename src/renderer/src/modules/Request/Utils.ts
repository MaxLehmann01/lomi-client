import {
    RequestAuthorization,
    RequestBody,
    RequestCookie,
    RequestHeader,
    RequestPathParam,
    RequestQueryParam,
} from '@renderer/src/modules/Request/Types';
import { IpcAxiosRequestConfig } from '@shared/Types/Api';
import HttpMethod from '@renderer/src/enums/HttpMethod';

function escapeAmpersand(raw: string): string {
    return raw.replaceAll('&', '%26');
}

function splitUrlAtFirstQuestionMark(url: string): {
    baseUrl: string;
    queryString: string;
} {
    const questionMarkIndex = url.indexOf('?');

    if (questionMarkIndex === -1) {
        return {
            baseUrl: url,
            queryString: '',
        };
    }

    return {
        baseUrl: url.slice(0, questionMarkIndex),
        queryString: url.slice(questionMarkIndex + 1),
    };
}

function extractPlaceholdersFromBaseUrl(baseUrl: string): string[] {
    const matches = baseUrl.matchAll(/\{([^{}]+)}/g);
    const keys: string[] = [];

    for (const match of matches) {
        const key = (match[1] ?? '').trim();

        if (key && !keys.includes(key)) {
            keys.push(key);
        }
    }

    return keys;
}

function applyPathParameters(
    baseUrl: string,
    pathParameters: RequestPathParam[]
): string {
    const valuesByKey = new Map(
        pathParameters
            .filter((p) => p.key.trim() !== '')
            .map((p) => [p.key, p.value] as const)
    );

    return baseUrl.replaceAll(/\{([^{}]+)}/g, (full, keyRaw) => {
        const key = String(keyRaw).trim();
        if (!key) {
            return full;
        }

        const value = valuesByKey.get(key);

        if (value === undefined) {
            return full;
        }

        return value;
    });
}

function toBase64(value: string): string {
    const bytes = new TextEncoder().encode(value);
    let binary = '';

    for (const b of bytes) {
        binary += String.fromCharCode(b);
    }

    return globalThis.btoa(binary);
}

export function buildRawUrlFromBaseAndQueryParameters(
    baseUrl: string,
    queryParams: RequestQueryParam[]
): string {
    const queryString = queryParams
        .filter((queryParam) => queryParam.isEnabled)
        .filter((queryParam) => queryParam.key.trim() !== '')
        .map((queryParam) => {
            const key = escapeAmpersand(queryParam.key);
            const value = escapeAmpersand(queryParam.value);

            if (value === '') {
                return key;
            }

            return `${key}=${value}`;
        })
        .join('&');

    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export function parseQueryParamsFromRawUrl(url: string): {
    baseUrl: string;
    queryParams: RequestQueryParam[];
} {
    const { baseUrl, queryString } = splitUrlAtFirstQuestionMark(url);

    if (!queryString) {
        return { baseUrl, queryParams: [] };
    }

    const queryParams = queryString
        .split('&')
        .filter((part) => part.length > 0)
        .map((part) => {
            const equalSignIndex = part.indexOf('=');

            if (equalSignIndex === -1) {
                return {
                    isEnabled: true,
                    key: part,
                    value: '',
                };
            }

            return {
                isEnabled: true,
                key: part.slice(0, equalSignIndex),
                value: part.slice(equalSignIndex + 1),
            };
        });

    return { baseUrl, queryParams };
}

export function syncPathParamsWithBaseUrl(
    baseUrl: string,
    existing: RequestPathParam[]
): RequestPathParam[] {
    const placeholders = extractPlaceholdersFromBaseUrl(baseUrl);

    const existingPathParamsByKey = new Map(
        existing.map((pathParam) => [pathParam.key, pathParam] as const)
    );

    return placeholders.map((key) => {
        const prev = existingPathParamsByKey.get(key);

        if (prev) {
            return prev;
        }

        return {
            key,
            value: '',
        };
    });
}

export function areQueryParamsEqual(
    a: RequestQueryParam[],
    b: RequestQueryParam[]
): boolean {
    if (a === b) {
        return true;
    }

    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (
            a[i].isEnabled !== b[i].isEnabled ||
            a[i].key !== b[i].key ||
            a[i].value !== b[i].value
        ) {
            return false;
        }
    }

    return true;
}

export function arePathParamsEqual(
    a: RequestPathParam[],
    b: RequestPathParam[]
): boolean {
    if (a === b) {
        return true;
    }

    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i].key !== b[i].key || a[i].value !== b[i].value) {
            return false;
        }
    }

    return true;
}

export function buildRequestConfig(
    method: HttpMethod,
    baseUrl: string,
    pathParams: RequestPathParam[],
    queryParams: RequestQueryParam[],
    authorization: RequestAuthorization,
    cookies: RequestCookie[],
    headers: RequestHeader[],
    body: RequestBody
): IpcAxiosRequestConfig {
    const baseWithPathApplied = applyPathParameters(baseUrl, pathParams);

    const url = buildRawUrlFromBaseAndQueryParameters(
        baseWithPathApplied,
        queryParams
    );

    const headerRecord = headers
        .filter((header) => header.isEnabled)
        .filter((header) => header.key.trim() !== '')
        .reduce(
            (acc, header) => {
                acc[header.key] = header.value;
                return acc;
            },
            {} as Record<string, string>
        );

    if (authorization.type === 'Basic') {
        const username = authorization.value.username;
        const password = authorization.value.password;

        if (username.length > 0 || password.length > 0) {
            headerRecord['Authorization'] =
                `Basic ${toBase64(`${username}:${password}`)}`;
        }
    }

    const cookiePairs = cookies
        .filter((cookie) => cookie.isEnabled)
        .filter((cookie) => cookie.key.trim() !== '')
        .map((c) => {
            const key = c.key.trim();
            const value = c.value ?? '';
            return `${key}=${value}`;
        });

    if (cookiePairs.length > 0) {
        headerRecord['Cookie'] = cookiePairs.join('; ');
    }

    return {
        method,
        url,
        headers: headerRecord,
        data: body.type === '' ? undefined : body.content,
    };
}
