import { AuthState } from '@renderer/src/modules/Auth/Types';

const STORAGE_KEY = 'lomi.auth';

function canUseLocalStorage(): boolean {
    try {
        return (
            typeof window !== 'undefined' &&
            typeof window.localStorage !== 'undefined'
        );
    } catch {
        return false;
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

export function getAuthState(): AuthState {
    if (!canUseLocalStorage()) {
        return {
            serverUrl: null,
            tokens: null,
            devices: null,
        };
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            throw new Error('Could not retrieve auth state from localStorage');
        }

        const parsed = JSON.parse(raw);
        if (!isRecord(parsed)) {
            throw new Error('Parsed auth state is not an object');
        }

        const serverUrl =
            typeof parsed['serverUrl'] === 'string'
                ? parsed['serverUrl']
                : null;

        const tokensRaw = parsed['tokens'];
        if (!tokensRaw || !isRecord(tokensRaw)) {
            throw new Error('Tokens in auth state is not an object');
        }

        const accessRaw = tokensRaw['accessToken'];
        const refreshRaw = tokensRaw['refreshToken'];
        if (!isRecord(accessRaw) || !isRecord(refreshRaw)) {
            throw new Error(
                'Access or refresh token in auth state is not an object'
            );
        }

        const accessToken = accessRaw['token'];
        const accessExpiresAt = accessRaw['expiresAt'];
        const refreshToken = refreshRaw['token'];
        const refreshExpiresAt = refreshRaw['expiresAt'];

        if (
            typeof accessToken !== 'string' ||
            typeof accessExpiresAt !== 'number' ||
            typeof refreshToken !== 'string' ||
            typeof refreshExpiresAt !== 'number'
        ) {
            throw new Error(
                'Access or refresh token in auth state has invalid shape'
            );
        }

        return {
            serverUrl,
            tokens: {
                accessToken: {
                    token: accessToken,
                    expiresAt: accessExpiresAt,
                },
                refreshToken: {
                    token: refreshToken,
                    expiresAt: refreshExpiresAt,
                },
            },
            devices: Array.isArray(parsed['devices'])
                ? parsed['devices']
                : null,
        };
    } catch {
        return { serverUrl: null, tokens: null, devices: null };
    }
}

export function saveAuthState(state: AuthState): void {
    if (!canUseLocalStorage()) {
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearAuthState(): void {
    if (!canUseLocalStorage()) {
        return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
}
