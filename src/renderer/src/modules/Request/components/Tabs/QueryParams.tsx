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
import { RequestQueryParam } from '@renderer/src/modules/Request/Types';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

export default function RequestQueryParamsTab({
    tabIndex,
    selectedTabIndex,
}: {
    tabIndex: number;
    selectedTabIndex: number;
}) {
    const { queryParams, setQueryParams } = useRequestConfig();

    function handleAddQueryParam() {
        setQueryParams((prev) => [
            ...prev,
            {
                isEnabled: true,
                key: '',
                value: '',
            },
        ]);
    }

    function handleEditQueryParam(
        index: number,
        updatedQueryParam: RequestQueryParam
    ) {
        setQueryParams((prev) => {
            const newQueryParams = [...prev];
            newQueryParams[index] = updatedQueryParam;
            return newQueryParams;
        });
    }

    function handleDeleteQueryParam(index: number) {
        setQueryParams((prev) => prev.filter((_, i) => i !== index));
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
                    {queryParams.map((queryParam, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Checkbox
                                    size={'small'}
                                    checked={queryParam.isEnabled}
                                    onChange={(e) =>
                                        handleEditQueryParam(index, {
                                            isEnabled: e.currentTarget.checked,
                                            key: queryParam.key,
                                            value: queryParam.value,
                                        })
                                    }
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    size={'small'}
                                    variant={'outlined'}
                                    fullWidth={true}
                                    placeholder={'Name of the Query Parameter'}
                                    value={queryParam.key}
                                    onChange={(e) =>
                                        handleEditQueryParam(index, {
                                            isEnabled: queryParam.isEnabled,
                                            key: e.currentTarget.value,
                                            value: queryParam.value,
                                        })
                                    }
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    size={'small'}
                                    variant={'outlined'}
                                    fullWidth={true}
                                    placeholder={'Value of the Query Parameter'}
                                    value={queryParam.value}
                                    onChange={(e) =>
                                        handleEditQueryParam(index, {
                                            isEnabled: queryParam.isEnabled,
                                            key: queryParam.key,
                                            value: e.currentTarget.value,
                                        })
                                    }
                                />
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    size={'small'}
                                    onClick={() =>
                                        handleDeleteQueryParam(index)
                                    }
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
                                onClick={handleAddQueryParam}
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
