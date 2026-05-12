import AuthContext from '@renderer/src/modules/Auth/state/AuthContext';
import {
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { apiRequest } from '@renderer/src/services/Api';
import {
    clearAuthState,
    getAuthState,
    saveAuthState,
} from '@renderer/src/modules/Auth/AuthStore';
import {
    AuthDevice,
    AuthEncryptedAccountKey,
    AuthState,
    AuthTokens,
    AuthUser,
    DeviceResponse,
} from '@renderer/src/modules/Auth/Types';
import { Device } from '@shared/Types/DeviceIdentity';

export default function AuthProvider({ children }: { children: ReactNode }) {
    const initialAuthState = useMemo(() => getAuthState(), []);
    const [thisDevice, setThisDevice] = useState<Device | null>(null);

    const [serverUrl, setServerUrl] = useState<string | null>(
        initialAuthState.serverUrl
    );
    const [tokens, setTokens] = useState<AuthState['tokens']>(
        initialAuthState.tokens
    );
    const [devices, setDevices] = useState<AuthState['devices']>(
        initialAuthState.devices
    );

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [user, setUser] = useState<AuthUser | null>(null);

    const refreshInFlightRef = useRef<Promise<void> | null>(null);
    const refreshTimerRef = useRef<number | null>(null);

    const fetchHealthCheck = useCallback(async (url): Promise<void> => {
        await apiRequest({
            method: 'GET',
            url,
        });
    }, []);

    const fetchUser = useCallback(
        async (
            url: string,
            accessToken: string,
            refreshToken: string
        ): Promise<AuthUser> => {
            const response = await apiRequest<{ data: AuthUser }>({
                method: 'GET',
                url: `${url}/auth/user`,
                headers: {
                    'x-auth-access-token': accessToken,
                    'x-auth-refresh-token': refreshToken,
                },
            });

            return response.data.data;
        },
        []
    );

    const fetchDevices = useCallback(
        async (
            url: string,
            accessToken: string,
            refreshToken: string
        ): Promise<AuthDevice[]> => {
            const response = await apiRequest<{ data: DeviceResponse[] }>({
                method: 'GET',
                url: `${url}/auth/devices`,
                headers: {
                    'x-auth-access-token': accessToken,
                    'x-auth-refresh-token': refreshToken,
                },
            });

            return response.data.data.map((device) => ({
                id: device.clientDeviceId,
                name: device.clientDeviceName,
                publicKey: device.publicKey,
            }));
        },
        []
    );

    const fetchNewTokens = useCallback(
        async (url: string, refreshToken: string): Promise<AuthTokens> => {
            const response = await apiRequest<{ data: AuthTokens }>({
                method: 'POST',
                url: `${url}/auth/refresh`,
                headers: {
                    'x-auth-refresh-token': refreshToken,
                },
            });

            return response.data.data;
        },
        []
    );

    const fetchAndSetUserAndDevices = useCallback(
        async (
            serverUrl: string,
            accessToken: string,
            refreshToken: string
        ) => {
            const [fetchedUser, fetchedDevices] = await Promise.all([
                fetchUser(serverUrl, accessToken, refreshToken),
                fetchDevices(serverUrl, accessToken, refreshToken),
            ]);

            setUser(fetchedUser);
            setDevices(fetchedDevices);
        },
        [fetchUser, fetchDevices]
    );

    const fetchAndSetThisDevice = useCallback(async () => {
        const device = await window.deviceIdentity.getDevice();
        setThisDevice(device);
    }, []);

    const removeDevice = useCallback(
        async (deviceId: AuthDevice['id']): Promise<void> => {
            if (tokens && serverUrl) {
                await apiRequest({
                    method: 'DELETE',
                    url: `${serverUrl}/auth/devices/${deviceId}`,
                    headers: {
                        'x-auth-access-token': tokens.accessToken.token,
                        'x-auth-refresh-token': tokens.refreshToken.token,
                    },
                });

                const devices = await fetchDevices(
                    serverUrl,
                    tokens.accessToken.token,
                    tokens.refreshToken.token
                );

                setDevices(devices);
            }
        },
        [tokens, serverUrl, fetchDevices]
    );

    const refreshTokens = useCallback(async () => {
        if (!serverUrl || !tokens) {
            return;
        }

        if (refreshInFlightRef.current) {
            return refreshInFlightRef.current;
        }

        const run = (async () => {
            const refreshResponse = await fetchNewTokens(
                serverUrl,
                tokens.refreshToken.token
            );

            const newTokens: AuthState['tokens'] = {
                accessToken: {
                    token: refreshResponse.accessToken.token,
                    expiresAt:
                        Date.now() +
                        refreshResponse.accessToken.expiresIn * 1000,
                },
                refreshToken: {
                    token: refreshResponse.refreshToken.token,
                    expiresAt:
                        Date.now() +
                        refreshResponse.refreshToken.expiresIn * 1000,
                },
            };

            setTokens(newTokens);

            saveAuthState({
                serverUrl,
                tokens: newTokens,
                devices,
            });

            await fetchAndSetUserAndDevices(
                serverUrl,
                newTokens.accessToken.token,
                newTokens.refreshToken.token
            );
        })().finally(() => {
            refreshInFlightRef.current = null;
        });

        refreshInFlightRef.current = run;
        return run;
    }, [serverUrl, tokens, devices, fetchNewTokens, fetchAndSetUserAndDevices]);

    const signIn = useCallback(
        async (
            serverUrl: string,
            username: string,
            password: string
        ): Promise<boolean> => {
            try {
                await fetchHealthCheck(serverUrl);

                const device = await window.deviceIdentity.getDevice();
                const publicKey = await window.deviceIdentity.getPublicKey();

                const signInResponse = await apiRequest<{
                    data: AuthTokens & {
                        encryptedAccountKey: AuthEncryptedAccountKey;
                    };
                }>({
                    method: 'POST',
                    url: `${serverUrl}/auth/sign-in`,
                    data: {
                        username,
                        password,
                        device,
                        publicKey,
                    },
                });

                const newTokens: AuthState['tokens'] = {
                    accessToken: {
                        token: signInResponse.data.data.accessToken.token,
                        expiresAt:
                            Date.now() +
                            signInResponse.data.data.accessToken.expiresIn *
                                1000,
                    },
                    refreshToken: {
                        token: signInResponse.data.data.refreshToken.token,
                        expiresAt:
                            Date.now() +
                            signInResponse.data.data.refreshToken.expiresIn *
                                1000,
                    },
                };

                const authUser = await fetchUser(
                    serverUrl,
                    newTokens.accessToken.token,
                    newTokens.refreshToken.token
                );

                const accountKeyBase64 =
                    await window.accountEncryption.decryptAccountKeyWithPassword(
                        password,
                        signInResponse.data.data.encryptedAccountKey
                    );

                const encryptedAccountKeyForDevice =
                    await window.deviceIdentity.encryptAccountKey(
                        accountKeyBase64
                    );

                await window.accountEncryption.saveLocalEncryptedAccountKey(
                    authUser.id,
                    encryptedAccountKeyForDevice
                );

                const authDevices = await fetchDevices(
                    serverUrl,
                    newTokens.accessToken.token,
                    newTokens.refreshToken.token
                );

                setServerUrl(serverUrl);
                setTokens(newTokens);
                setUser(authUser);
                setDevices(authDevices);

                saveAuthState({
                    serverUrl,
                    tokens: newTokens,
                    devices: authDevices,
                });

                setIsLoading(false);

                return true;
            } catch (e) {
                setIsLoading(false);
                throw e;
            }
        },
        [fetchHealthCheck, fetchUser, fetchDevices]
    );

    const signOut = useCallback(async () => {
        setIsLoading(true);

        try {
            if (tokens && serverUrl) {
                if (thisDevice) {
                    try {
                        await removeDevice(thisDevice.id);
                    } catch {
                        // If removing the device fails, we still want to proceed with signing out.
                    }
                }

                await apiRequest({
                    method: 'DELETE',
                    url: `${serverUrl}/auth/sign-out`,
                    headers: {
                        'x-auth-access-token': tokens.accessToken.token,
                        'x-auth-refresh-token': tokens.refreshToken.token,
                    },
                });
            }

            setServerUrl(null);
            setTokens(null);
            setUser(null);
            setDevices([]);
            clearAuthState();

            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            throw e;
        }
    }, [tokens, serverUrl, thisDevice, removeDevice]);

    useEffect(() => {
        void fetchAndSetThisDevice();

        if (serverUrl && tokens) {
            void fetchAndSetUserAndDevices(
                serverUrl,
                tokens.accessToken.token,
                tokens.refreshToken.token
            );
        }
    }, [serverUrl, tokens, fetchAndSetUserAndDevices, fetchAndSetThisDevice]);

    useEffect(() => {
        if (refreshTimerRef.current !== null) {
            window.clearTimeout(refreshTimerRef.current);
            refreshTimerRef.current = null;
        }

        if (!serverUrl || !tokens) {
            return;
        }

        const msUntilExpiry = tokens.accessToken.expiresAt - Date.now();
        const msUntilThreshold = msUntilExpiry - 15 * 60 * 1000;

        if (msUntilThreshold <= 0) {
            void refreshTokens();
            return;
        }

        refreshTimerRef.current = window.setTimeout(() => {
            void refreshTokens();
        }, msUntilThreshold);

        return () => {
            if (refreshTimerRef.current !== null) {
                window.clearTimeout(refreshTimerRef.current);
                refreshTimerRef.current = null;
            }
        };
    }, [serverUrl, tokens?.accessToken.expiresAt, refreshTokens]);

    const contextValue = useMemo(
        () => ({
            isLoading,
            user,
            devices,
            thisDevice,
            signIn,
            signOut,
            removeDevice,
            serverUrl,
            tokens,
        }),
        [
            isLoading,
            user,
            devices,
            thisDevice,
            signIn,
            signOut,
            removeDevice,
            serverUrl,
            tokens,
        ]
    );

    return <AuthContext.Provider value={contextValue} children={children} />;
}
