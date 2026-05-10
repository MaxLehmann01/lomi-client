import { apiRequest } from '@renderer/src/services/Api';
import { useEffect, useState } from 'react';
import { IpcAxiosResult } from '@shared/Types/Api';
import { Device, Keypair } from '@shared/Types/DeviceIdentity';

export default function App() {
    const [response, setResponse] = useState<IpcAxiosResult | null>(null);
    const [device, setDevice] = useState<Device | null>(null);
    const [publicKey, setPublicKey] = useState<Keypair['publicKey'] | null>(
        null
    );

    const fetchAndSetData = async () => {
        const response = await apiRequest({
            method: 'GET',
            url: 'https://jsonplaceholder.typicode.com/users',
        });

        setResponse(response);
        setDevice(await window.deviceIdentity.getDevice());
        setPublicKey(await window.deviceIdentity.getPublicKey());
    };

    useEffect(() => {
        fetchAndSetData();
    }, []);

    return (
        <div>
            <h1 className={'text-4xl p-2 text-red-900'}>
                Hello World from React + TailwindCSS!
            </h1>
            <br />
            <span>Device: {JSON.stringify(device)}</span>
            <br />
            <span>PublicKey: {publicKey}</span>
            <br />
            <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
    );
}
