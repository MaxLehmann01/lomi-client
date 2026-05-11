import { IpcMainInvokeEvent } from 'electron';
import { clearLocalEncryptedAccountKey } from '@main/modules/AccountEncryption/LocalAccountKey';

export default async function AccountEncryptionClearLocalEncryptedAccountKeyIpcHandler(
    _: IpcMainInvokeEvent
) {
    await clearLocalEncryptedAccountKey();

    return true;
}
