type Device = {
    id: string;
    name: string;
};

export type Keypair = {
    privateKey: string;
    publicKey: string;
};

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
