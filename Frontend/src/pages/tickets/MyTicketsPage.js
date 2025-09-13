import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CancelIcon from '@mui/icons-material/Cancel';

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tickets/my-tickets');
      setTickets(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load tickets. Please try again later.');
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCancelTicket = (ticket) => {
    setSelectedTicket(ticket);
    setCancelDialogOpen(true);
  };

  const confirmCancelTicket = async () => {
    if (!selectedTicket) return;
    
    setIsCancelling(true);
    setCancelError(null);
    
    try {
      await axios.post('/api/tickets/cancel', {
        ticketId: selectedTicket._id
      });
      
      setCancelSuccess(true);
      setCancelDialogOpen(false);
      
      // Refresh tickets
      fetchTickets();
    } catch (err) {
      console.error('Error cancelling ticket:', err);
      setCancelError(err.response?.data?.message || 'Failed to cancel ticket. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const closeCancelDialog = () => {
    setCancelDialogOpen(false);
  };

  // Filter tickets based on tab
  const filteredTickets = tickets.filter(ticket => {
    const eventDate = new Date(ticket.event.date);
    const today = new Date();
    
    if (tabValue === 0) { // Upcoming
      return eventDate >= today && !ticket.cancelled;
    } else if (tabValue === 1) { // Past
      return eventDate < today && !ticket.cancelled;
    } else { // Cancelled
      return ticket.cancelled;
    }
  });

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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Tickets
      </Typography>
      
      {cancelSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Ticket cancelled successfully! Your refund will be processed according to our refund policy.
        </Alert>
      )}
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="ticket tabs">
          <Tab label="Upcoming" />
          <Tab label="Past" />
          <Tab label="Cancelled" />
        </Tabs>
      </Box>
      
      {filteredTickets.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">
            {tabValue === 0
              ? "You don't have any upcoming tickets."
              : tabValue === 1
              ? "You don't have any past tickets."
              : "You don't have any cancelled tickets."}
          </Typography>
          {tabValue === 0 && (
            <Button
              variant="contained"
              component={RouterLink}
              to="/events"
              sx={{ mt: 2 }}
            >
              Browse Events
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredTickets.map((ticket) => (
            <Grid item key={ticket._id} xs={12} md={6} lg={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {ticket.cancelled && (
                  <Chip
                    label="Cancelled"
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      zIndex: 1,
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {ticket.event.name}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EventIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {formatDate(ticket.event.date)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {ticket.event.time}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {ticket.event.location}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ConfirmationNumberIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Seats: {ticket.seats}
                    </Typography>
                  </Box>
                  
                  <Chip
                    label={`$${ticket.price}`}
                    color="primary"
                    sx={{ mt: 2 }}
                  />
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      component={RouterLink}
                      to={`/tickets/${ticket._id}`}
                    >
                      View Details
                    </Button>
                    
                    {tabValue === 0 && !ticket.cancelled && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleCancelTicket(ticket)}
                        startIcon={<CancelIcon />}
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Cancel Ticket Dialog */}
      <Dialog open={cancelDialogOpen} onClose={closeCancelDialog}>
        <DialogTitle>Cancel Ticket</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your ticket for {selectedTicket?.event.name}? This action cannot be undone.
          </DialogContentText>
          {cancelError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {cancelError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCancelDialog} disabled={isCancelling}>
            Keep Ticket
          </Button>
          <Button onClick={confirmCancelTicket} color="error" disabled={isCancelling}>
            {isCancelling ? <CircularProgress size={24} /> : 'Cancel Ticket'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyTicketsPage;