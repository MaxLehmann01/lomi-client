import TabPanel from '@renderer/src/modules/Shared/components/TabPanel';
import { useRequestConfig } from '@renderer/src/modules/Request/state/RequestConfig';
import {
    Button,
    Checkbox,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { RequestHeader } from '@renderer/src/modules/Request/Types';

export default function RequestHeadersTab({
    tabIndex,
    selectedTabIndex,
}: {
    tabIndex: number;
    selectedTabIndex: number;
}) {
    const { headers, setHeaders } = useRequestConfig();

    function handleAddHeader() {
        setHeaders((prev) => [
            ...prev,
            {
                isEnabled: true,
                key: '',
                value: '',
            },
        ]);
    }

    function handleEditHeader(index: number, updatedHeader: RequestHeader) {
        setHeaders((prev) => {
            const newHeaders = [...prev];
            newHeaders[index] = updatedHeader;
            return newHeaders;
        });
    }

    function handleDeleteHeader(index: number) {
        setHeaders((prev) => prev.filter((_, i) => i !== index));
    }

    return (
        <TabPanel
            use={'request-configurator'}
            tabIndex={tabIndex}
            selectedTabIndex={selectedTabIndex}
        >
            <Table size={'small'} className={'w-full table-fixed'}>
                <colgroup>
                    <col className={'w-17.5'} />
                    <col className={'w-auto'} />
                    <col className={'w-auto'} />
                    <col className={'w-17.5'} />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell>Enabled</TableCell>
                        <TableCell>Key</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {headers.map((header, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Checkbox
                                    size={'small'}
                                    checked={header.isEnabled}
                                    onChange={(e) =>
                                        handleEditHeader(index, {
                                            isEnabled: e.currentTarget.checked,
                                            key: header.key,
                                            value: header.value,
                                        })
                                    }
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    size={'small'}
                                    variant={'outlined'}
                                    fullWidth={true}
                                    placeholder={'Name of the header'}
                                    value={header.key}
                                    onChange={(e) =>
                                        handleEditHeader(index, {
                                            isEnabled: header.isEnabled,
                                            key: e.currentTarget.value,
                                            value: header.value,
                                        })
                                    }
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    size={'small'}
                                    variant={'outlined'}
                                    fullWidth={true}
                                    placeholder={'Value of the header'}
                                    value={header.value}
                                    onChange={(e) =>
                                        handleEditHeader(index, {
                                            isEnabled: header.isEnabled,
                                            key: header.key,
                                            value: e.currentTarget.value,
                                        })
                                    }
                                />
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    size={'small'}
                                    onClick={() => handleDeleteHeader(index)}
                                >
                                    <DeleteIcon
                                        fontSize={'small'}
                                        color={'error'}
                                    />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={4}>
                            <Button
                                size={'small'}
                                variant={'outlined'}
                                fullWidth={true}
                                onClick={handleAddHeader}
                            >
                                <AddIcon fontSize={'small'} />
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TabPanel>
    );
}
