import { CssBaseline, ThemeProvider } from '@mui/material';
import Theme from '@renderer/src/theme/Theme';
import Layout from '@renderer/src/modules/Layout/Layout';
import AuthProvider from '@renderer/src/modules/Auth/state/AuthProvider';
import { RequestConfigProvider } from '@renderer/src/modules/Request/state/RequestConfig';

export default function App() {
    return (
        <ThemeProvider theme={Theme}>
            <CssBaseline />
            <AuthProvider>
                <RequestConfigProvider>
                    <Layout />
                </RequestConfigProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
