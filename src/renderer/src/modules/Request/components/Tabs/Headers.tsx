import TabPanel from '@renderer/src/modules/Shared/components/TabPanel';
import { useRequestConfig } from '@renderer/src/modules/Request/state/RequestConfig';
import {
    Alert,
    Button,
    Checkbox,
    Divider,
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
import { useEffect, useMemo, useState } from 'react';

type BlockedHeaderKey = 'authorization' | 'cookie';

type BlockedHeader = {
    index: number;
    key: BlockedHeaderKey;
} | null;

function normalizeHeaderKey(key: string) {
    return key.trim().toLowerCase();
}

function isBlockedHeaderKey(key: string): key is BlockedHeaderKey {
    return key === 'authorization' || key === 'cookie';
}

export default function RequestHeadersTab({
    tabIndex,
    selectedTabIndex,
}: {
    tabIndex: number;
    selectedTabIndex: number;
}) {
    const { headers, setHeaders } = useRequestConfig();
    const [blockedHeader, setBlockedHeader] = useState<BlockedHeader>(null);

    const blockedHeaderByIndex = useMemo(() => {
        const blockedHeaders = new Map<number, BlockedHeaderKey>();

        headers.forEach((header, index) => {
            const normalizedKey = normalizeHeaderKey(header.key);

            if (isBlockedHeaderKey(normalizedKey)) {
                blockedHeaders.set(index, normalizedKey);
            }
        });

        return blockedHeaders;
    }, [headers]);

    const hasBlockedHeader = blockedHeaderByIndex.size > 0;

    function handleAddHeader() {
        if (hasBlockedHeader) {
            return;
        }

        setHeaders((prev) => [
            ...prev,
            { isEnabled: true, key: '', value: '' },
        ]);
    }

    function handleEditHeader(index: number, updatedHeader: RequestHeader) {
        setHeaders((prev) => {
            const next = [...prev];
            next[index] = updatedHeader;
            return next;
        });

        const normalizedKey = normalizeHeaderKey(updatedHeader.key);

        if (isBlockedHeaderKey(normalizedKey)) {
            setBlockedHeader({ index, key: normalizedKey });
        }
    }

    function handleDeleteHeader(index: number) {
        setHeaders((prev) => prev.filter((_, i) => i !== index));
    }

    function handleRemoveBlockedHeader() {
        if (!blockedHeader) {
            return;
        }

        setHeaders((prev) => prev.filter((_, i) => i !== blockedHeader.index));
    }

    const blockedHeaderMessage =
        blockedHeader?.key === 'authorization'
            ? 'The `Authorization` header is managed in the `Authorization` tab. Please rename the key or remove this row.'
            : blockedHeader?.key === 'cookie'
              ? 'The `Cookie` header is managed in the `Cookies` tab. Please rename the key or remove this row.'
              : '';

    useEffect(() => {
        if (!hasBlockedHeader) {
            if (blockedHeader) {
                setBlockedHeader(null);
            }

            return;
        }

        if (blockedHeader) {
            const currentBlockedKey = blockedHeaderByIndex.get(
                blockedHeader.index
            );

            if (currentBlockedKey === blockedHeader.key) {
                return;
            }
        }

        const firstBlockedHeader = blockedHeaderByIndex.entries().next()
            .value as [number, BlockedHeaderKey] | undefined;

        if (!firstBlockedHeader) {
            return;
        }

        const [index, key] = firstBlockedHeader;

        setBlockedHeader({ index, key });
    }, [hasBlockedHeader, blockedHeaderByIndex, blockedHeader]);

    return (
        <TabPanel
            use={'request-configurator'}
            tabIndex={tabIndex}
            selectedTabIndex={selectedTabIndex}
        >
            {hasBlockedHeader && blockedHeader && (
                <>
                    <Alert
                        severity={'error'}
                        onClose={() => setBlockedHeader(null)}
                        action={
                            <Button
                                size={'small'}
                                color={'inherit'}
                                onClick={handleRemoveBlockedHeader}
                            >
                                Okay, remove
                            </Button>
                        }
                        children={blockedHeaderMessage}
                    />
                    <Divider />
                </>
            )}
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
                    {headers.map((header, index) => {
                        const blockedHeaderKey =
                            blockedHeaderByIndex.get(index);
                        const isBlockedHeaderRow =
                            blockedHeaderKey !== undefined;

                        return (
                            <TableRow key={index}>
                                <TableCell>
                                    <Checkbox
                                        size={'small'}
                                        checked={header.isEnabled}
                                        onChange={(e) =>
                                            handleEditHeader(index, {
                                                isEnabled:
                                                    e.currentTarget.checked,
                                                key: header.key,
                                                value: header.value,
                                            })
                                        }
                                        disabled={hasBlockedHeader}
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
                                        disabled={
                                            hasBlockedHeader &&
                                            !isBlockedHeaderRow
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
                                        disabled={hasBlockedHeader}
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        size={'small'}
                                        onClick={() =>
                                            handleDeleteHeader(index)
                                        }
                                        disabled={
                                            hasBlockedHeader &&
                                            !isBlockedHeaderRow
                                        }
                                    >
                                        <DeleteIcon
                                            fontSize={'small'}
                                            color={
                                                hasBlockedHeader &&
                                                !isBlockedHeaderRow
                                                    ? 'disabled'
                                                    : 'error'
                                            }
                                        />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    <TableRow>
                        <TableCell colSpan={4}>
                            <Button
                                size={'small'}
                                variant={'outlined'}
                                fullWidth={true}
                                onClick={handleAddHeader}
                                disabled={hasBlockedHeader}
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
