import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';

interface ApiResponse {
  message: string;
  timestamp: string;
  status: string;
}

const ApiTest: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/ms/rest/unrtmng/hello');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card sx={{ maxWidth: 600, margin: '2rem auto' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Backend API Test
        </Typography>
        
        <Box sx={{ marginBottom: 2 }}>
          <Button 
            variant="contained" 
            onClick={fetchData}
            disabled={loading}
            sx={{ marginRight: 1 }}
          >
            {loading ? <CircularProgress size={20} /> : 'Refresh'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        {data && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Response from Backend:
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Message:</strong> {data.message}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Timestamp:</strong> {data.timestamp}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Status:</strong> {data.status}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiTest; 