import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const PurchaseHistory = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      if (!token) {
        setError('Please log in to view your purchase history');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get('/tickets/my-tickets');
        setTickets(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching purchase history:', err);
        if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
        } else if (err.response?.status === 403) {
          setError('You are not authorized to view this data.');
        } else {
          setError('Failed to load purchase history. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [token]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (tickets.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body1" gutterBottom>
          You haven't purchased any tickets yet.
        </Typography>
        <Button
          component={RouterLink}
          to="/events"
          variant="contained"
          color="primary"
          sx={{ mt: 1 }}
        >
          Browse Events
        </Button>
      </Box>
    );
  }

  // Sort tickets by purchase date (most recent first)
  const sortedTickets = [...tickets].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Only show the 5 most recent purchases
  const recentTickets = sortedTickets.slice(0, 5);

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><strong>Event</strong></TableCell>
            <TableCell><strong>Date</strong></TableCell>
            <TableCell><strong>Amount</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recentTickets.map((ticket) => (
            <TableRow key={ticket._id}>
              <TableCell>
                <RouterLink 
                  to={`/events/${ticket.event._id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Typography variant="body2" color="primary">
                    {ticket.event.name}
                  </Typography>
                </RouterLink>
              </TableCell>
              <TableCell>{formatDate(ticket.createdAt)}</TableCell>
              <TableCell>{formatCurrency(ticket.event.ticketPrice * ticket.seats)}</TableCell>
              <TableCell>
                {ticket.cancelled ? (
                  <Chip size="small" label="Cancelled" color="error" />
                ) : (
                  <Chip size="small" label="Confirmed" color="success" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {tickets.length > 5 && (
        <Box sx={{ textAlign: 'center', p: 1 }}>
          <Button 
            component={RouterLink} 
            to="/my-tickets" 
            size="small"
          >
            View All Purchases
          </Button>
        </Box>
      )}
    </TableContainer>
  );
};

export default PurchaseHistory;