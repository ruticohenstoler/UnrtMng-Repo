import React from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import {CssBaseline, AppBar, Toolbar, Typography, Container, Button, Box} from '@mui/material';
import styled, {ThemeProvider} from 'styled-components';
import DecisionsTable from './pages/DecisionsTable.tsx.txt';
import ColumnsManagement from './pages/ColumnsManagement.tsx.txt';

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
                </Box>
            </Toolbar>
        </AppBar>
        <StyledContainer>
            <Routes>
                <Route path="/" element={<DecisionsTable/>}/>
                <Route path="/columns" element={<ColumnsManagement/>}/>
            </Routes>
        </StyledContainer>
    </>
);

export default App; 