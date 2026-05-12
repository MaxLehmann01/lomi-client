export type Device = {
    id: string;
    name: string;
};

export type Keypair = {
    privateKey: string;
    publicKey: string;
};

export type EncryptedAccountKeyForDevice = {
    version: 1;
    algorithm: 'RSA-OAEP-SHA256';
    encryptedAccountKey: string;
};
