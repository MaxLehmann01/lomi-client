import { Device, Keypair } from '@shared/Types/DeviceIdentity';

export type DeviceIdentity = {
    device: Device;
    keypair: Keypair;
};

export type DeviceIdentityRecord = {
    device: Device;
    keypair: {
        encryptedPrivateKey: string;
        publicKey: Keypair['publicKey'];
    };
    createdAt: string;
};

export type EncryptedAccountKeyForDevice = {
    version: 1;
    algorithm: 'RSA-OAEP-SHA256';
    encryptedAccountKey: string;
};
