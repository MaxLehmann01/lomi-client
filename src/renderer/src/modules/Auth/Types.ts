export type AuthState = {
    serverUrl: string | null;
    tokens: {
        accessToken: {
            token: string;
            expiresAt: number;
        };
        refreshToken: {
            token: string;
            expiresAt: number;
        };
    } | null;
    devices: AuthDevice[] | null;
};

export type AuthUser = {
    id: string;
    name: string;
};

export type AuthDevice = {
    id: string;
    name: string;
    publicKey: string;
};

export type DeviceResponse = {
    clientDeviceId: string;
    clientDeviceName: string;
    publicKey: string;
};

export type AuthTokens = {
    accessToken: {
        token: string;
        expiresIn: number;
    };
    refreshToken: {
        token: string;
        expiresIn: number;
    };
};
