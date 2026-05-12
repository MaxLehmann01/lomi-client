import { IpcMainInvokeEvent } from 'electron';
import { encryptPayloadWithAccountKey } from '@main/modules/AccountEncryption/PayloadEncryption';

export default async function AccountEncryptionEncryptPayloadIpcHandler(
    _: IpcMainInvokeEvent,
    payload: unknown,
    accountKeyBase64: string
) {
    return encryptPayloadWithAccountKey(payload, accountKeyBase64);
}
