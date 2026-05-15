import TabPanel from '@renderer/src/modules/Shared/components/TabPanel';
import { Divider, MenuItem, Select, TextField } from '@mui/material';
import { useRequestConfig } from '@renderer/src/modules/Request/state/RequestConfig';
import { RequestAuthorization } from '@renderer/src/modules/Request/Types';
import { useState } from 'react';

export default function RequestAuthorizationTab({
    tabIndex,
    selectedTabIndex,
}: {
    tabIndex: number;
    selectedTabIndex: number;
}) {
    const { authorization, setAuthorization } = useRequestConfig();

    const [basicUsername, setBasicUsername] = useState<string>('');
    const [basicPassword, setBasicPassword] = useState<string>('');

    function handleChangeAuthorizationType(
        authorizationType: RequestAuthorization['type']
    ) {
        handleResetAuthorizationValues();

        switch (authorizationType) {
            case 'Basic': {
                setAuthorization({
                    type: 'Basic',
                    value: {
                        username: '',
                        password: '',
                    },
                });

                break;
            }
            default: {
                setAuthorization({
                    type: '',
                    value: null,
                });
            }
        }
    }

    function handleResetAuthorizationValues() {
        setBasicUsername('');
        setBasicPassword('');
    }

    function handleChangeBasicUsername(username: string) {
        if (authorization.type !== 'Basic') {
            return;
        }

        setBasicUsername(username);
        setAuthorization({
            type: 'Basic',
            value: {
                ...authorization.value,
                username,
            },
        });
    }

    function handleChangeBasicPassword(password: string) {
        if (authorization.type !== 'Basic') {
            return;
        }

        setBasicPassword(password);
        setAuthorization({
            type: 'Basic',
            value: {
                ...authorization.value,
                password,
            },
        });
    }

    return (
        <TabPanel
            use={'request-configurator'}
            tabIndex={tabIndex}
            selectedTabIndex={selectedTabIndex}
        >
            <div className={'h-full w-full flex flex-col gap-2 p-2 min-h-0'}>
                <Select
                    size={'small'}
                    variant={'outlined'}
                    displayEmpty={true}
                    value={authorization.type}
                    onChange={(e) =>
                        handleChangeAuthorizationType(e.target.value)
                    }
                >
                    <MenuItem value={''}>None</MenuItem>
                    <MenuItem value={'Basic'}>Basic</MenuItem>
                </Select>
                <Divider />
                <div className={'flex flex-col gap-2'}>
                    {authorization.type === 'Basic' && (
                        <>
                            <TextField
                                size={'small'}
                                variant={'outlined'}
                                label={'Username'}
                                value={basicUsername}
                                onChange={(e) =>
                                    handleChangeBasicUsername(e.target.value)
                                }
                            />
                            <TextField
                                size={'small'}
                                variant={'outlined'}
                                label={'Password'}
                                value={basicPassword}
                                onChange={(e) =>
                                    handleChangeBasicPassword(e.target.value)
                                }
                            />
                        </>
                    )}
                </div>
            </div>
        </TabPanel>
    );
}
