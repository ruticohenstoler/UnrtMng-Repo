import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.tsx.txt';
import ThemeCrmTs from '../../../style/theme-crm';
import {CacheProvider} from '@emotion/react';
import createCache from '@emotion/cache';
import {ThemeProvider} from 'styled-components';
import {ThemeProvider as MuiThemeProvider} from '@mui/material/styles';
import {CssBaseline} from '@mui/material';
import {prefixer} from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

function getBaseName() {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
    return isLocal ? '' : '/apps/unrtmng/unrtmng';
}

root.render(
    <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={ThemeCrmTs}>
            <MuiThemeProvider theme={ThemeCrmTs}>
                <CssBaseline/>
                <BrowserRouter basename={getBaseName()}>
                    <App/>
                </BrowserRouter>
            </MuiThemeProvider>
        </ThemeProvider>
    </CacheProvider>
);
