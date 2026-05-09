import { apiRequest } from '@renderer/src/services/Api';
import { useEffect, useState } from 'react';
import { IpcAxiosResult } from '@shared/Types/Api';

export default function App() {
    const [response, setResponse] = useState<IpcAxiosResult | null>(null);

    const fetchAndSetData = async () => {
        const response = await apiRequest({
            method: 'GET',
            url: 'https://jsonplaceholder.typicode.com/users',
        });

        setResponse(response);
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
            <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
    );
}
