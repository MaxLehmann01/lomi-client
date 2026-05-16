import { useRequestConfig } from '@renderer/src/modules/Request/state/RequestConfig';

export default function ResponseContainer() {
    const { requestConfig } = useRequestConfig();

    return (
        <div className="min-h-full flex flex-col p-2 gap-2">
            <pre>{JSON.stringify(requestConfig, null, 2)}</pre>
        </div>
    );
}
