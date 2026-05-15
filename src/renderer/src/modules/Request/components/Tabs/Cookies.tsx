import TabPanel from '@renderer/src/modules/Shared/components/TabPanel';
import { useRequestConfig } from '@renderer/src/modules/Request/state/RequestConfig';
import { RequestCookie } from '@renderer/src/modules/Request/Types';
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

export default function RequestCookiesTab({
    tabIndex,
    selectedTabIndex,
}: {
    tabIndex: number;
    selectedTabIndex: number;
}) {
    const { cookies, setCookies } = useRequestConfig();

    function handleAddCookie() {
        setCookies((prev) => [
            ...prev,
            {
                isEnabled: true,
                key: '',
                value: '',
            },
        ]);
    }

    function handleEditCookie(index: number, updatedCookie: RequestCookie) {
        setCookies((prev) => {
            const newCookies = [...prev];
            newCookies[index] = updatedCookie;
            return newCookies;
        });
    }

    function handleDeleteCookie(index: number) {
        setCookies((prev) => prev.filter((_, i) => i !== index));
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
                    {cookies.map((cookie, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Checkbox
                                    size={'small'}
                                    checked={cookie.isEnabled}
                                    onChange={(e) =>
                                        handleEditCookie(index, {
                                            isEnabled: e.currentTarget.checked,
                                            key: cookie.key,
                                            value: cookie.value,
                                        })
                                    }
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    size={'small'}
                                    variant={'outlined'}
                                    fullWidth={true}
                                    placeholder={'Name of the cookie'}
                                    value={cookie.key}
                                    onChange={(e) =>
                                        handleEditCookie(index, {
                                            isEnabled: cookie.isEnabled,
                                            key: e.currentTarget.value,
                                            value: cookie.value,
                                        })
                                    }
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    size={'small'}
                                    variant={'outlined'}
                                    fullWidth={true}
                                    placeholder={'Value of the cookie'}
                                    value={cookie.value}
                                    onChange={(e) =>
                                        handleEditCookie(index, {
                                            isEnabled: cookie.isEnabled,
                                            key: cookie.key,
                                            value: e.currentTarget.value,
                                        })
                                    }
                                />
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    size={'small'}
                                    onClick={() => handleDeleteCookie(index)}
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
                                onClick={handleAddCookie}
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
