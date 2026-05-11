import { IpcMainInvokeEvent } from 'electron';
import {
    decryptAccountKeyWithPassword,
    EncryptedAccountKey,
} from '@main/modules/AccountEncryption/AccountEncryption';

export default async function AccountEncryptionDecryptAccountKeyWithPasswordIpcHandler(
    _: IpcMainInvokeEvent,
    password: string,
    encryptedAccountKey: EncryptedAccountKey
) {
    const accountKey = decryptAccountKeyWithPassword(
        password,
        encryptedAccountKey
    );

    return accountKey.toString('base64');
}
