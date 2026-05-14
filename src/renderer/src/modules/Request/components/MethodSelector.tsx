import { MenuItem, Select } from '@mui/material';
import HttpMethod from '@renderer/src/enums/HttpMethod';
import { useRequestConfig } from '@renderer/src/modules/Request/state/RequestConfig';

export default function RequestMethodSelector() {
    const { method, setMethod } = useRequestConfig();

    return (
        <Select
            size={'small'}
            variant={'outlined'}
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            className={'w-34'}
            autoWidth={false}
        >
            {Object.values(HttpMethod).map((method) => (
                <MenuItem key={method} value={method}>
                    {method}
                </MenuItem>
            ))}
        </Select>
    );
}
