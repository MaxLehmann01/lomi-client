import { EncryptedAccountKeyForDevice } from '@shared/Types/DeviceIdentity';

export type EncryptedPayload = {
    version: 1;
    algorithm: 'AES-256-GCM';
    iv: string;
    authTag: string;
    encryptedData: string;
};

export type LocalEncryptedAccountKeyRecord = {
    version: 1;
    userId: string;
    encryptedAccountKeyForDevice: EncryptedAccountKeyForDevice;
    createdAt: string;
    updatedAt: string;
};

export type EncryptedAccountKey = {
    version: 1;
    algorithm: 'AES-256-GCM';
    kdf: {
        algorithm: 'scrypt';
        salt: string;
        N: number;
        r: number;
        p: number;
        keyLength: number;
    };
    iv: string;
    authTag: string;
    encryptedKey: string;
};
