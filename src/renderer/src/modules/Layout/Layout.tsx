import { Divider } from '@mui/material';
import AuthButton from '@renderer/src/modules/Auth/components/AuthButton';
import useAuth from '@renderer/src/modules/Auth/state/useAuth';
import { useEffect, useState } from 'react';

export default function Layout() {
    const { user } = useAuth();

    const [encryptedAccountKey, setEncryptedAccountKey] = useState<any>(null);
    const [decryptedAccountKey, setDecryptedAccountKey] = useState<any>(null);

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

    return (
        <div className={'h-full w-full flex flex-col'}>
            <div className={'flex-1'}>
                <pre>{JSON.stringify(user, null, 2)}</pre>
                <Divider />
                <pre>{JSON.stringify(encryptedAccountKey, null, 2)}</pre>
                <Divider />
                <pre>{JSON.stringify(decryptedAccountKey, null, 2)}</pre>
            </div>
            <Divider />
            <div className={'w-full p-2'}>
                <AuthButton />
            </div>
        </div>
    );
}
