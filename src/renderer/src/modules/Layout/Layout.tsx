import { Divider } from '@mui/material';
import AuthButton from '@renderer/src/modules/Auth/components/AuthButton';

export default function Layout() {
    return (
        <div className={'h-full w-full flex flex-col'}>
            <div className={'flex-1'}>Content</div>
            <Divider />
            <div className={'w-full p-2'}>
                <AuthButton />
            </div>
        </div>
    );
}
