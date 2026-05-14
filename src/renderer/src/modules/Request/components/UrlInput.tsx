import { TextField } from '@mui/material';
import { useRequestConfig } from '@renderer/src/modules/Request/state/RequestConfig';

export default function RequestUrlInput() {
    const { rawUrl, setRawUrl } = useRequestConfig();

    return (
        <TextField
            variant={'outlined'}
            size={'small'}
            placeholder={'URL'}
            value={rawUrl}
            onChange={(e) => setRawUrl(e.target.value)}
            fullWidth={true}
        />
    );
}
