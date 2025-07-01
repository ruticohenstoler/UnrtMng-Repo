import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApiTest from '../ApiTest.tsx,txt';

// Mock fetch globally
global.fetch = jest.fn();

describe('ApiTest Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component title', () => {
    render(<ApiTest />);
    expect(screen.getByText('Backend API Test')).toBeInTheDocument();
  });

  it('shows loading state when fetching data', async () => {
    (fetch as jest.Mock).mockImplementation(() => 
      new Promise(() => {}) // Never resolves to simulate loading
    );

    render(<ApiTest />);
    
    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeDisabled();
    });
  });

  it('displays data when API call is successful', async () => {
    const mockData = {
      message: 'Hello from Backend!',
      timestamp: '2023-01-01T12:00:00',
      status: 'success'
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    render(<ApiTest />);

    await waitFor(() => {
      expect(screen.getByText('Hello from Backend!')).toBeInTheDocument();
      expect(screen.getByText('2023-01-01T12:00:00')).toBeInTheDocument();
      expect(screen.getByText('success')).toBeInTheDocument();
    });
  });

  it('displays error when API call fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<ApiTest />);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('refreshes data when refresh button is clicked', async () => {
    const mockData = {
      message: 'Updated message',
      timestamp: '2023-01-01T12:00:00',
      status: 'success'
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    render(<ApiTest />);

    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText('Updated message')).toBeInTheDocument();
    });
  });
}); 