import { IpcMainInvokeEvent } from 'electron';
import { decryptAccountKeyForCurrentDevice } from '@main/modules/DeviceIdentity/DeviceIdentity';
import { EncryptedAccountKeyForDevice } from '@main/modules/DeviceIdentity/Types';

export default async function DeviceIdentityDecryptAccountKeyIpcHandler(
    _: IpcMainInvokeEvent,
    encryptedAccountKeyForDevice: EncryptedAccountKeyForDevice
) {
    const accountKey = decryptAccountKeyForCurrentDevice(
        encryptedAccountKeyForDevice
    );

    return accountKey.toString('base64');
}
