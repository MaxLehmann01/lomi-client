import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import useAuth from '@renderer/src/modules/Auth/state/useAuth';
import { Delete as DeleteIcon } from '@mui/icons-material';

export default function AuthUserDialog({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const { user, devices, signOut, removeDevice, thisDevice } = useAuth();

    const handleClose = () => {
        onClose();
    };

    const handleRemoveDevice = async (deviceId: string) => {
        await removeDevice(deviceId);
    };

    const handleSignOut = async () => {
        await signOut();
        handleClose();
    };

    if (!user || !devices || !thisDevice) {
        return null;
    }

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            maxWidth={'sm'}
            fullWidth={true}
        >
            <DialogTitle variant={'h4'}>{user.name}</DialogTitle>
            <Divider />
            <DialogContent className={'flex flex-col gap-4'}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Device Name</TableCell>
                            <TableCell>Remove</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {devices.map((device) => {
                            return device.id === thisDevice.id ? (
                                <TableRow key={device.id}>
                                    <TableCell className={'font-bold'}>
                                        {device.name}
                                    </TableCell>
                                    <TableCell>/</TableCell>
                                </TableRow>
                            ) : (
                                <TableRow key={device.id}>
                                    <TableCell>{device.name}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            size={'small'}
                                            color={'error'}
                                            onClick={() =>
                                                handleRemoveDevice(device.id)
                                            }
                                        >
                                            <DeleteIcon fontSize={'small'} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </DialogContent>
            <Divider />
            <DialogActions>
                <div className={'w-full flex justify-between'}>
                    <Button
                        size={'small'}
                        variant={'outlined'}
                        color={'error'}
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </Button>
                    <Button
                        size={'small'}
                        variant={'text'}
                        color={'error'}
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    );
}
