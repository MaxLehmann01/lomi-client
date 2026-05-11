import { IpcMainInvokeEvent } from 'electron';
import { encryptAccountKeyForCurrentDevice } from '@main/modules/DeviceIdentity/DeviceIdentity';

export default async function DeviceIdentityEncryptAccountKeyIpcHandler(
    _: IpcMainInvokeEvent,
    accountKeyBase64: string
) {
    const accountKey = Buffer.from(accountKeyBase64, 'base64');

    return encryptAccountKeyForCurrentDevice(accountKey);
}
