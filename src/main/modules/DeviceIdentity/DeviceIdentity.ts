import {
    Device,
    DeviceIdentity,
    DeviceIdentityRecord,
    Keypair,
} from '@main/modules/DeviceIdentity/Types';
import path from 'path';
import { app, safeStorage } from 'electron';
import crypto from 'crypto';
import { promises as fs } from 'node:fs';
import os from 'node:os';

const FILE_NAME = 'device_identity.json';

let cachedDeviceIdentity: DeviceIdentity | null = null;

function getFilePath(): string {
    return path.join(app.getPath('userData'), FILE_NAME);
}

function generateKeypair(): Keypair {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });

    return {
        publicKey,
        privateKey,
    };
}

async function encryptPrivateKey(privateKey: string): Promise<string> {
    if (!safeStorage.isEncryptionAvailable()) {
        throw new Error(
            'Safe storage encryption is not available on this system'
        );
    }

    return safeStorage.encryptString(privateKey).toString('base64');
}

async function decryptPrivateKey(encryptedPrivateKey: string): Promise<string> {
    if (!safeStorage.isEncryptionAvailable()) {
        throw new Error(
            'Safe storage encryption is not available on this platform.'
        );
    }

    const encryptedBuffer = Buffer.from(encryptedPrivateKey, 'base64');
    return safeStorage.decryptString(encryptedBuffer);
}

async function writeDeviceIdentity(identity: DeviceIdentity): Promise<void> {
    const filePath = getFilePath();

    await fs.mkdir(path.dirname(filePath), { recursive: true });

    const encryptedPrivateKey = await encryptPrivateKey(
        identity.keypair.privateKey
    );

    const deviceIdentityRecord: DeviceIdentityRecord = {
        device: identity.device,
        keypair: {
            encryptedPrivateKey,
            publicKey: identity.keypair.publicKey,
        },
        createdAt: new Date().toISOString(),
    };

    await fs.writeFile(
        filePath,
        JSON.stringify(deviceIdentityRecord, null, 2),
        {
            encoding: 'utf-8',
            mode: 0o600,
        }
    );
}

function getCachedDeviceIdentity(): DeviceIdentity {
    if (!cachedDeviceIdentity) {
        throw new Error('Device identity has not been initialized yet.');
    }

    return cachedDeviceIdentity;
}

export async function getOrCreateDeviceIdentity(): Promise<DeviceIdentity> {
    if (cachedDeviceIdentity) {
        return cachedDeviceIdentity;
    }

    const filePath = getFilePath();

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const storedIdentity = JSON.parse(fileContent) as DeviceIdentity;

        const decryptedPrivateKey = await decryptPrivateKey(
            storedIdentity.keypair.privateKey
        );

        cachedDeviceIdentity = {
            device: storedIdentity.device,
            keypair: {
                publicKey: storedIdentity.keypair.publicKey,
                privateKey: decryptedPrivateKey,
            },
        };

        return cachedDeviceIdentity;
    } catch {
        const newDeviceIdentity = {
            device: {
                id: crypto.randomUUID(),
                name: `${os.userInfo().username}@${os.hostname()}`,
            },
            keypair: generateKeypair(),
        };

        await writeDeviceIdentity(newDeviceIdentity);
        cachedDeviceIdentity = newDeviceIdentity;

        return cachedDeviceIdentity;
    }
}

export function getDevice(): Device {
    return getCachedDeviceIdentity().device;
}

export function getPublicKey(): Keypair['publicKey'] {
    return getCachedDeviceIdentity().keypair.publicKey;
}
