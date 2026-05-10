import { Button } from '@mui/material';
import { useState } from 'react';
import AuthSignInDialog from '@renderer/src/modules/Auth/components/dialogs/SignIn';
import { Login as LoginIcon, Person as PersonIcon } from '@mui/icons-material';
import useAuth from '@renderer/src/modules/Auth/state/useAuth';
import AuthUserDialog from '@renderer/src/modules/Auth/components/dialogs/User';

export default function AuthButton() {
    const { user } = useAuth();

    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState<boolean>(false);

    const handleOpenAuthDialog = () => {
        setIsAuthDialogOpen(true);
    };

    const handleCloseAuthDialog = () => {
        setIsAuthDialogOpen(false);
    };

    if (user) {
        return (
            <>
                <Button
                    size={'small'}
                    variant={'outlined'}
                    onClick={handleOpenAuthDialog}
                    startIcon={<PersonIcon />}
                >
                    {user.name}
                </Button>
                <AuthUserDialog
                    isOpen={isAuthDialogOpen}
                    onClose={handleCloseAuthDialog}
                />
            </>
        );
    }

    return (
        <>
            <Button
                size={'small'}
                variant={'outlined'}
                onClick={handleOpenAuthDialog}
                startIcon={<LoginIcon />}
            >
                Login
            </Button>
            <AuthSignInDialog
                isOpen={isAuthDialogOpen}
                onClose={handleCloseAuthDialog}
            />
        </>
    );
}
