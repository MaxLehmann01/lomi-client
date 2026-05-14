import { useState } from 'react';
import { TextField } from '@mui/material';

export default function RequestUrlInput() {
    const [url, setUrl] = useState<string>('');

    return (
        <TextField
            variant={'outlined'}
            size={'small'}
            placeholder={'URL'}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            fullWidth={true}
        />
    );
}
