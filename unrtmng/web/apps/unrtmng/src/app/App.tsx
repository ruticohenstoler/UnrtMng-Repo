import React from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import {CssBaseline, AppBar, Toolbar, Typography, Container, Button, Box} from '@mui/material';
import styled, {ThemeProvider} from 'styled-components';
import DecisionsTable from './pages/DecisionsTable.tsx';
import ColumnsManagement from './pages/ColumnsManagement.tsx';
import AdminPage from './pages/AdminPage';

const StyledContainer = styled(Container)`
    margin-top: 2rem;
`;

const App: React.FC = () => (
    <>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{flexGrow: 1}}>
                    מערכת ניהול החלטות חיתום
                </Typography>
                <Box sx={{display: 'flex', gap: 1}}>
                    <Button color="inherit" component={Link} to="/">
                        טבלת החלטות
                    </Button>
                    <Button color="inherit" component={Link} to="/columns">
                        ניהול עמודות
                    </Button>
                    <Button color="inherit" component={Link} to="/admin">
                        ניהול מערכת
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
        <StyledContainer>
            <Routes>
                <Route path="/" element={<DecisionsTable/>}/>
                <Route path="/columns" element={<ColumnsManagement/>}/>
                <Route path="/admin" element={<AdminPage/>}/>
            </Routes>
        </StyledContainer>
    </>
);

export default App; 