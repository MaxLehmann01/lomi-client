import {
    RequestPathParam,
    RequestQueryParam,
} from '@renderer/src/modules/Request/Types';

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
