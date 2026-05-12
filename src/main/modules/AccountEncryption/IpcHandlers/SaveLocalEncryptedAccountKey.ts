import { IpcMainInvokeEvent } from 'electron';
import { saveLocalEncryptedAccountKey } from '@main/modules/AccountEncryption/LocalAccountKey';
import { EncryptedAccountKeyForDevice } from '@shared/Types/DeviceIdentity';

export default async function AccountEncryptionSaveLocalEncryptedAccountKeyIpcHandler(
    _: IpcMainInvokeEvent,
    userId: string,
    encryptedAccountKeyForDevice: EncryptedAccountKeyForDevice
) {
    return saveLocalEncryptedAccountKey(userId, encryptedAccountKeyForDevice);
}
