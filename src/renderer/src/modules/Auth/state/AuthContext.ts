import { createContext } from 'react';
import { AuthDevice, AuthUser } from '@renderer/src/modules/Auth/Types';
import { Device } from '@shared/Types/DeviceIdentity';

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
};

export default createContext<AuthContext | undefined>(undefined);
