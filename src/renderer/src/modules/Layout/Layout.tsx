import { Button, Divider, TextField } from '@mui/material';
import AuthButton from '@renderer/src/modules/Auth/components/AuthButton';
import useAuth from '@renderer/src/modules/Auth/state/useAuth';
import { useEffect, useState } from 'react';
import { EncryptedPayload } from '@shared/Types/AccountEncryption';

export default function Layout() {
    const { user } = useAuth();

    const [encryptedAccountKey, setEncryptedAccountKey] = useState<any>(null);
    const [decryptedAccountKey, setDecryptedAccountKey] = useState<any>(null);

    const [payload, setPayload] = useState<string>('');
    const [encryptedPayload, setEncryptedPayload] =
        useState<EncryptedPayload | null>(null);

    const handleEncryptPayload = async () => {
        try {
            setEncryptedPayload(
                await window.accountEncryption.encryptPayload(
                    payload,
                    decryptedAccountKey
                )
            );
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (user) {
            (async () => {
                const eak =
                    await window.accountEncryption.loadLocalEncryptedAccountKey(
                        user.id
                    );

                setEncryptedAccountKey(eak);

                if (eak) {
                    const dak = await window.deviceIdentity.decryptAccountKey(
                        eak.encryptedAccountKeyForDevice
                    );
                    setDecryptedAccountKey(dak);
                }
            })();
        }
    }, [user]);

    useEffect(() => {
        if (encryptedPayload) {
            (async () => {
                try {
                    console.log(encryptedPayload);
                    const decryptedPayload =
                        await window.accountEncryption.decryptPayload(
                            encryptedPayload,
                            decryptedAccountKey
                        );
                    console.log('Decrypted Payload:', decryptedPayload);
                } catch (e) {
                    console.error('Failed to decrypt payload:', e);
                }
            })();
        }
    }, [encryptedPayload]);

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
                    <Button variant={'outlined'} onClick={handleEncryptPayload}>
                        Encrypt
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
