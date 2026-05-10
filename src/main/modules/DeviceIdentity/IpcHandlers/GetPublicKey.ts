import { IpcMainInvokeEvent } from 'electron';
import { getPublicKey } from '@main/modules/DeviceIdentity/DeviceIdentity';

export default async function DeviceIdentityGetPublicKeyIpcHandler(
    _: IpcMainInvokeEvent
) {
    return getPublicKey();
}
