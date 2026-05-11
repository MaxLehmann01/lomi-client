import { IpcMainInvokeEvent } from 'electron';
import { loadLocalEncryptedAccountKey } from '@main/modules/AccountEncryption/LocalAccountKey';

export default async function AccountEncryptionLoadLocalEncryptedAccountKeyIpcHandler(
    _: IpcMainInvokeEvent
) {
    return loadLocalEncryptedAccountKey();
}
