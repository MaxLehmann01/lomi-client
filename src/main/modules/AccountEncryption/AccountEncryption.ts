import crypto from 'crypto';
import { EncryptedAccountKey } from '@shared/Types/AccountEncryption';

function deriveAccountKeyEncryptionKey(
    password: string,
    salt: Buffer,
    keyLength: number,
    N: number,
    r: number,
    p: number
): Buffer {
    return crypto.scryptSync(password, salt, keyLength, {
        N,
        r,
        p,
    });
}

export function decryptAccountKeyWithPassword(
    password: string,
    encryptedAccountKey: EncryptedAccountKey
): Buffer {
    if (!password || typeof password !== 'string') {
        throw new Error('Password is required.');
    }

    if (!encryptedAccountKey || typeof encryptedAccountKey !== 'object') {
        throw new Error('Encrypted account key is required.');
    }

    if (encryptedAccountKey.version !== 1) {
        throw new Error('Unsupported encrypted account key version.');
    }

    if (encryptedAccountKey.algorithm !== 'AES-256-GCM') {
        throw new Error('Unsupported encrypted account key algorithm.');
    }

    if (encryptedAccountKey.kdf.algorithm !== 'scrypt') {
        throw new Error('Unsupported account key KDF.');
    }

    const wrappingKey = deriveAccountKeyEncryptionKey(
        password,
        Buffer.from(encryptedAccountKey.kdf.salt, 'base64'),
        encryptedAccountKey.kdf.keyLength,
        encryptedAccountKey.kdf.N,
        encryptedAccountKey.kdf.r,
        encryptedAccountKey.kdf.p
    );

    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        wrappingKey,
        Buffer.from(encryptedAccountKey.iv, 'base64')
    );

    decipher.setAuthTag(Buffer.from(encryptedAccountKey.authTag, 'base64'));

    const accountKey = Buffer.concat([
        decipher.update(
            Buffer.from(encryptedAccountKey.encryptedKey, 'base64')
        ),
        decipher.final(),
    ]);

    if (accountKey.length !== 32) {
        throw new Error('Invalid account key length.');
    }

    return accountKey;
}
