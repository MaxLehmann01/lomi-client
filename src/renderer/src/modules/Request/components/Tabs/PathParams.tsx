import TabPanel from '@renderer/src/modules/Shared/components/TabPanel';
import { useRequestConfig } from '@renderer/src/modules/Request/state/RequestConfig';
import { RequestPathParam } from '@renderer/src/modules/Request/Types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';

export default function RequestPathParamsTab({
    tabIndex,
    selectedTabIndex,
}: {
    tabIndex: number;
    selectedTabIndex: number;
}) {
    const { pathParams, setPathParams } = useRequestConfig();

    function handleEditQueryParam(
        index: number,
        value: RequestPathParam['value']
    ) {
        const next = [...pathParams];
        next[index] = { ...next[index], value };
        setPathParams(next);
    }

    return (
        <TabPanel
            use={'request-configurator'}
            tabIndex={tabIndex}
            selectedTabIndex={selectedTabIndex}
        >
            <Table size={'small'} className={'w-full table-fixed'}>
                <colgroup>
                    <col className={'w-1/2'} />
                    <col className={'w-1/2'} />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell>Key</TableCell>
                        <TableCell>Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pathParams.map((pathParam, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <TextField
                                    size={'small'}
                                    variant={'outlined'}
                                    fullWidth={true}
                                    value={pathParam.key}
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    size={'small'}
                                    variant={'outlined'}
                                    fullWidth={true}
                                    placeholder={'Value of the Path Parameter'}
                                    value={pathParam.value}
                                    onChange={(e) =>
                                        handleEditQueryParam(
                                            index,
                                            e.currentTarget.value
                                        )
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TabPanel>
    );
}
