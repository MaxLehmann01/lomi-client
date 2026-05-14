import RequestMethodSelector from '@renderer/src/modules/Request/components/MethodSelector';
import RequestUrlInput from '@renderer/src/modules/Request/components/UrlInput';
import { Button, Divider } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import RequestTabsWrapper from '@renderer/src/modules/Request/components/TabsWrapper';

export default function RequestConfigurator() {
    return (
        <div className="h-full min-h-0 flex flex-col p-2 gap-2 overflow-hidden">
            <div className="flex gap-2 shrink-0">
                <RequestMethodSelector />
                <RequestUrlInput />
                <Button
                    className="px-4"
                    size="small"
                    variant="outlined"
                    endIcon={<SendIcon />}
                >
                    Send
                </Button>
            </div>
            <Divider className="shrink-0" />
            <RequestTabsWrapper />
        </div>
    );
}
