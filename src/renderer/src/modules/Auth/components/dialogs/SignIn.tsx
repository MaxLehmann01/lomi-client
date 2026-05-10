import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    InputAdornment,
    TextField,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import useAuth from '@renderer/src/modules/Auth/state/useAuth';
import {
    Password as PasswordIcon,
    Person as PersonIcon,
    Storage as StorageIcon,
} from '@mui/icons-material';
import { isValidUrl } from '@renderer/src/modules/Auth/Utils';

export default function AuthSignInDialog({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const { signIn } = useAuth();

    const [serverUrl, setServerUrl] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [isInvalidUrl, setIsInvalidUrl] = useState<boolean>(false);
    const [isSignInError, setIsSignInError] = useState<boolean>(false);

    const handleClose = () => {
        setServerUrl('');
        setUsername('');
        setPassword('');
        setIsInvalidUrl(false);
        onClose();
    };

    const handleSignIn = async () => {
        try {
            if (!isValidUrl(serverUrl)) {
                setIsInvalidUrl(true);

                return;
            }

            if (!(await signIn(serverUrl, username, password))) {
                setIsSignInError(true);

                return;
            }

            handleClose();
        } catch (error) {
            console.error('Sign in failed:', error);
        }
    };

    const handleServerChangeUrl = (e: ChangeEvent<HTMLInputElement>) => {
        setServerUrl(e.target.value);
        setIsInvalidUrl(false);
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            maxWidth={'sm'}
            fullWidth={true}
        >
            <DialogTitle variant={'h4'}>Sign In</DialogTitle>
            <Divider />
            <DialogContent className={'flex flex-col gap-4'}>
                <TextField
                    size={'medium'}
                    variant={'outlined'}
                    type={'text'}
                    label={'Server URL'}
                    placeholder={'https://lomi-server.example.com'}
                    value={serverUrl}
                    onChange={handleServerChangeUrl}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <StorageIcon fontSize={'small'} />
                                </InputAdornment>
                            ),
                        },
                    }}
                    error={isInvalidUrl}
                    helperText={isInvalidUrl ? 'Please enter a valid URL' : ''}
                />
                <TextField
                    size={'medium'}
                    variant={'outlined'}
                    type={'text'}
                    label={'Username'}
                    placeholder={'Enter your username'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon fontSize={'small'} />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                <TextField
                    size={'medium'}
                    variant={'outlined'}
                    type={'password'}
                    label={'Password'}
                    placeholder={'Enter your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PasswordIcon fontSize={'small'} />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                {isSignInError && (
                    <Alert
                        severity={'error'}
                        onClose={() => setIsSignInError(false)}
                    >
                        Failed to sign in. Check your Server URL and credentials
                    </Alert>
                )}
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button
                    size={'small'}
                    variant={'text'}
                    color={'error'}
                    onClick={handleClose}
                >
                    Cancel
                </Button>
                <Button
                    size={'small'}
                    variant={'outlined'}
                    onClick={handleSignIn}
                >
                    Sign In
                </Button>
            </DialogActions>
        </Dialog>
    );
}
