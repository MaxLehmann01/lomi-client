import { app } from 'electron';
import path from 'path';
import { promises as fs } from 'node:fs';
import { EncryptedAccountKeyForDevice } from '@main/modules/DeviceIdentity/Types';

const FILE_NAME = 'local_account_key.json';

export type LocalEncryptedAccountKeyRecord = {
    version: 1;
    userId: string;
    encryptedAccountKeyForDevice: EncryptedAccountKeyForDevice;
    createdAt: string;
    updatedAt: string;
};

function getFilePath(): string {
    return path.join(app.getPath('userData'), FILE_NAME);
}

export async function saveLocalEncryptedAccountKey(
    userId: string,
    encryptedAccountKeyForDevice: EncryptedAccountKeyForDevice
): Promise<LocalEncryptedAccountKeyRecord> {
    const filePath = getFilePath();

    await fs.mkdir(path.dirname(filePath), {
        recursive: true,
    });

    const now = new Date().toISOString();

    const record: LocalEncryptedAccountKeyRecord = {
        version: 1,
        userId,
        encryptedAccountKeyForDevice,
        createdAt: now,
        updatedAt: now,
    };

    await fs.writeFile(filePath, JSON.stringify(record, null, 2), {
        encoding: 'utf-8',
        mode: 0o600,
    });

    return record;
}

export async function loadLocalEncryptedAccountKey(): Promise<LocalEncryptedAccountKeyRecord | null> {
    try {
        const fileContent = await fs.readFile(getFilePath(), 'utf-8');
        const record = JSON.parse(
            fileContent
        ) as LocalEncryptedAccountKeyRecord;

        if (record.version !== 1) {
            throw new Error('Unsupported local account key version.');
        }

        if (!record.userId || typeof record.userId !== 'string') {
            throw new Error('Invalid local account key userId.');
        }

        if (
            !record.encryptedAccountKeyForDevice ||
            record.encryptedAccountKeyForDevice.algorithm !== 'RSA-OAEP-SHA256'
        ) {
            throw new Error('Invalid local encrypted account key.');
        }

        return record;
    } catch {
        return null;
    }
}

export async function clearLocalEncryptedAccountKey(): Promise<void> {
    try {
        await fs.unlink(getFilePath());
    } catch {
        // Ignore if file does not exist.
    }
}
