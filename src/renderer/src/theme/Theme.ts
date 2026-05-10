import { createTheme } from '@mui/material/styles';

export default createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: 'Poppins, "Helvetica Neue", sans-serif',
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 600,
        htmlFontSize: 16,
        h1: {
            fontWeight: 600,
            fontSize: '2.375rem',
            lineHeight: 1.21,
            letterSpacing: '-0.01562em',
        },
        h2: {
            fontWeight: 600,
            fontSize: '1.875rem',
            lineHeight: 1.27,
            letterSpacing: '-0.00833em',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.33,
            letterSpacing: '0em',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.4,
            letterSpacing: '0.00735em',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.5,
            letterSpacing: '0em',
        },
        h6: {
            fontWeight: 400,
            fontSize: '0.875rem',
            lineHeight: 1.57,
            letterSpacing: '0.0075em',
        },
        subtitle1: {
            fontWeight: 600,
            fontSize: '0.875rem',
            lineHeight: 1.57,
            letterSpacing: '0.00938em',
        },
        subtitle2: {
            fontWeight: 500,
            fontSize: '0.75rem',
            lineHeight: 1.66,
            letterSpacing: '0.00714em',
        },
        body1: {
            fontWeight: 400,
            fontSize: '0.875rem',
            lineHeight: 1.57,
            letterSpacing: '0.00938em',
        },
        body2: {
            fontWeight: 400,
            fontSize: '0.75rem',
            lineHeight: 1.66,
            letterSpacing: '0.01071em',
        },
        button: {
            fontWeight: 400,
            fontSize: '0.8125rem',
            lineHeight: 1.75,
            letterSpacing: '0.02857em',
            textTransform: 'uppercase' as const,
        },
        caption: {
            fontWeight: 400,
            fontSize: '0.75rem',
            lineHeight: 1.66,
            letterSpacing: '0.03333em',
        },
        overline: {
            fontWeight: 400,
            fontSize: '0.75rem',
            lineHeight: 2.66,
            letterSpacing: '0.08333em',
            textTransform: 'uppercase' as const,
        },
    },
});
