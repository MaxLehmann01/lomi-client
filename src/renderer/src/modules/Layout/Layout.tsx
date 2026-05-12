// src/renderer/src/modules/Layout/Layout.tsx
import { Button, Divider, TextField } from '@mui/material';
import AuthButton from '@renderer/src/modules/Auth/components/AuthButton';
import useAuth from '@renderer/src/modules/Auth/state/useAuth';
import { apiRequest } from '@renderer/src/services/Api';
import { useEffect, useState } from 'react';
import { EncryptedPayload } from '@shared/Types/AccountEncryption';

export default function Layout() {
    const { serverUrl, tokens, user } = useAuth();

    const [encryptedAccountKey, setEncryptedAccountKey] = useState<any>(null);
    const [decryptedAccountKey, setDecryptedAccountKey] = useState<any>(null);

    const [payload, setPayload] = useState<string>('');

    const handleSaveRequest = async () => {
        if (!serverUrl || !tokens || !user || !decryptedAccountKey) return;

        try {
            const encrypted = await window.accountEncryption.encryptPayload(
                payload,
                decryptedAccountKey
            );

            await apiRequest({
                method: 'POST',
                url: `${serverUrl}/requests`,
                data: encrypted,
                headers: {
                    'x-auth-access-token': tokens.accessToken.token,
                    'x-auth-refresh-token': tokens.refreshToken.token,
                },
            });
        } catch (e) {
            console.error(e);
        }
    };

    const fetchAndDecryptRequests = async (accountKey: string) => {
        if (!serverUrl || !tokens || !user) return;

        const response = await apiRequest<{ data: any[] }>({
            method: 'GET',
            url: `${serverUrl}/requests`,
            headers: {
                'x-auth-access-token': tokens.accessToken.token,
                'x-auth-refresh-token': tokens.refreshToken.token,
            },
        });

        const decrypted = await Promise.all(
            (response.data.data ?? []).map(async (req) => {
                const encryptedConfig = req?.encryptedConfig as
                    | EncryptedPayload
                    | undefined;

                if (!encryptedConfig) return null;

                try {
                    return await window.accountEncryption.decryptPayload(
                        encryptedConfig,
                        accountKey
                    );
                } catch (err) {
                    console.error(`decrypt failed`, {
                        err,
                        encryptedConfig,
                        accountKeyType: typeof accountKey,
                        accountKeyIsNull: accountKey == null,
                    });
                    return null;
                }
            })
        );

        console.log(decrypted.filter((x) => x != null));
    };

    useEffect(() => {
        if (!user) return;

        (async () => {
            try {
                const eak =
                    await window.accountEncryption.loadLocalEncryptedAccountKey(
                        user.id
                    );

                setEncryptedAccountKey(eak);
                if (!eak) return;

                const dak = await window.deviceIdentity.decryptAccountKey(
                    eak.encryptedAccountKeyForDevice
                );

                setDecryptedAccountKey(dak);

                // Important: use `dak` directly \- don’t rely on async state update
                await fetchAndDecryptRequests(dak);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [user, serverUrl, tokens]);

    return (
        <div className={'h-full w-full flex flex-col'}>
            <div className={'flex-1'}>
                <pre>{JSON.stringify(user, null, 2)}</pre>
                <Divider />
                <pre>{JSON.stringify(encryptedAccountKey, null, 2)}</pre>
                <Divider />
                <pre>{JSON.stringify(decryptedAccountKey, null, 2)}</pre>
                <Divider />
                <div>
                    <TextField
                        size={'small'}
                        variant={'outlined'}
                        value={payload}
                        placeholder={'Payload'}
                        onChange={(e) => setPayload(e.target.value)}
                    />
                    <Button variant={'outlined'} onClick={handleSaveRequest}>
                        Save
                    </Button>
                </div>
            </div>
            <Divider />
            <div className={'w-full p-2'}>
                <AuthButton />
            </div>
        </div>
    );
}
