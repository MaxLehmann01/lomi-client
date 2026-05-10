import { IpcMainInvokeEvent } from 'electron';
import { getDevice } from '@main/modules/DeviceIdentity/DeviceIdentity';

export default async function DeviceIdentityGetDeviceIpcHandler(
    _: IpcMainInvokeEvent
) {
    return getDevice();
}
