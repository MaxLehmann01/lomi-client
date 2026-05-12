import {
    AuthDevice,
    AuthState,
    AuthUser,
} from '@renderer/src/modules/Auth/Types';
import { Device } from '@shared/Types/DeviceIdentity';
import { createContext } from 'react';

type AuthContext = {
    isLoading: boolean;
    user: AuthUser | null;
    devices: AuthDevice[] | null;
    thisDevice: Device | null;
    signIn: (
        serverUrl: string,
        username: string,
        password: string
    ) => Promise<boolean>;
    signOut: () => Promise<void>;
    removeDevice: (deviceId: AuthDevice['id']) => Promise<void>;
    serverUrl: string | null;
    tokens: AuthState['tokens'] | null;
};

export default createContext<AuthContext | undefined>(undefined);
