import { CssBaseline, ThemeProvider } from '@mui/material';
import Theme from '@renderer/src/theme/Theme';
import Layout from '@renderer/src/modules/Layout/Layout';
import AuthProvider from '@renderer/src/modules/Auth/state/AuthProvider';

export default function App() {
    return (
        <ThemeProvider theme={Theme}>
            <CssBaseline />
            <AuthProvider>
                <Layout />
            </AuthProvider>
        </ThemeProvider>
    );
}
