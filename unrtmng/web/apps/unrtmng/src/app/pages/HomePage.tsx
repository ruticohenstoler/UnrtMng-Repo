import React from 'react';
import { Typography, Box } from '@mui/material';
import ApiTest from '../components/ApiTest';

const HomePage: React.FC = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Welcome to the Underwriting Decision Management System
    </Typography>
    <Typography variant="body1" paragraph>
      Manage your underwriting decisions efficiently and securely.
    </Typography>
    
    <ApiTest />
  </Box>
);

export default HomePage; 