import crypto from 'crypto';
import { EncryptedPayload } from '@shared/Types/AccountEncryption';

export function encryptPayloadWithAccountKey(
    payload: unknown,
    accountKeyBase64: string
): EncryptedPayload {
    const accountKey = Buffer.from(accountKeyBase64, 'base64');

    if (accountKey.length !== 32) {
        throw new Error('Account key must be 32 bytes.');
    }

    const plaintext = JSON.stringify(payload);

    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv('aes-256-gcm', accountKey, iv);

    const encryptedData = Buffer.concat([
        cipher.update(plaintext, 'utf8'),
        cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return {
        version: 1,
        algorithm: 'AES-256-GCM',
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        encryptedData: encryptedData.toString('base64'),
    };
}

export function decryptPayloadWithAccountKey<T = unknown>(
    encryptedPayload: EncryptedPayload,
    accountKeyBase64: string
): T {
    const accountKey = Buffer.from(accountKeyBase64, 'base64');

    if (accountKey.length !== 32) {
        throw new Error('Account key must be 32 bytes.');
    }

    if (!encryptedPayload || typeof encryptedPayload !== 'object') {
        throw new Error('Encrypted payload is required.');
    }

    if (encryptedPayload.version !== 1) {
        throw new Error('Unsupported encrypted payload version.');
    }

    if (encryptedPayload.algorithm !== 'AES-256-GCM') {
        throw new Error('Unsupported encrypted payload algorithm.');
    }

    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        accountKey,
        Buffer.from(encryptedPayload.iv, 'base64')
    );

    decipher.setAuthTag(Buffer.from(encryptedPayload.authTag, 'base64'));

    const plaintext = Buffer.concat([
        decipher.update(Buffer.from(encryptedPayload.encryptedData, 'base64')),
        decipher.final(),
    ]);

    return JSON.parse(plaintext.toString('utf8')) as T;
}
