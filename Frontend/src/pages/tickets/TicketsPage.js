import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const TicketsPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user || !token) {
        setError('Please log in to view your tickets');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/tickets/my-tickets');
        setTickets(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
          // Optionally redirect to login
          // navigate('/login');
        } else if (err.response?.status === 403) {
          setError('You are not authorized to view these tickets.');
        } else {
          setError('Failed to load tickets. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, token, navigate]);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)',
      backgroundImage: 'url(https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: 4,
      boxShadow: 3,
      py: 6,
      px: { xs: 2, md: 6 },
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'rgba(255,255,255,0.7)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Tickets
        </Typography>

        {tickets.length === 0 ? (
          <Alert severity="info">
            You haven't purchased any tickets yet. Browse our events to find something interesting!
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {tickets.map((ticket) => (
              <Grid item xs={12} md={6} key={ticket._id}>
                <Card sx={{ background: 'rgba(255,255,255,0.9)', borderRadius: 3, boxShadow: 4 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {ticket.event.name}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={ticket.event.category}
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={`${ticket.seats} ${ticket.seats === 1 ? 'Ticket' : 'Tickets'}`}
                        color="secondary"
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      <strong>Date:</strong> {formatDate(ticket.event.date)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      <strong>Time:</strong> {ticket.event.time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      <strong>Location:</strong> {ticket.event.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      <strong>Purchase Date:</strong> {formatDate(ticket.createdAt)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      <strong>Total Amount:</strong> ${(ticket.event.ticketPrice * ticket.seats).toFixed(2)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/tickets/${ticket._id}`)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default TicketsPage; 