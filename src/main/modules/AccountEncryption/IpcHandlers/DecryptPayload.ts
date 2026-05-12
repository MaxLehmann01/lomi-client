import { IpcMainInvokeEvent } from 'electron';
import { decryptPayloadWithAccountKey } from '@main/modules/AccountEncryption/PayloadEncryption';
import { EncryptedPayload } from '@shared/Types/AccountEncryption';

export default async function AccountEncryptionDecryptPayloadIpcHandler(
    _: IpcMainInvokeEvent,
    encryptedPayload: EncryptedPayload,
    accountKeyBase64: string
) {
    return decryptPayloadWithAccountKey(encryptedPayload, accountKeyBase64);
}
