import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Divider,
  Paper,
  TextField,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Snackbar,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CategoryIcon from '@mui/icons-material/Category';
import { useAuth } from '../../context/AuthContext';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seats, setSeats] = useState(1);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // If the ID is 'create', redirect to the create event page
        if (id === 'create') {
          navigate('/events/create');
          return;
        }

        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        console.error('Error fetching event:', err);
        if (err.response?.status === 404) {
          setError('Event not found');
        } else if (err.response?.status === 401) {
          setError('You need to be logged in to view event details.');
        } else {
          setError('Failed to load event details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSeatsChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= event.availableSeats) {
      setSeats(value);
    }
  };

  const handleBookTicket = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setOpenDialog(true);
  };

  const handleConfirmBooking = async () => {
    try {
      setIsBooking(true);
      setBookingError(null);
      
      const response = await api.post('/tickets', {
        eventId: event._id,
        seats: seats
      });
      
      setBookingSuccess(true);
      console.log("Booking successful, setting bookingSuccess to true");
      setOpenDialog(false);
      
      // Store the ticket data in localStorage for the ticket details page
      localStorage.setItem('lastBookedTicket', JSON.stringify(response.data.ticket));
      
      // Delay redirect to allow Snackbar to be visible
      setTimeout(() => {
        navigate(`/tickets/${response.data.ticket._id}`);
      }, 3000); // Show success message for 3 seconds
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to book tickets. Please try again.');
    } finally {
      setIsBooking(false);
    }
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

  if (!event) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">Event not found</Alert>
      </Container>
    );
  }

   // Check if the logged-in user is the organizer of the event
  const isOrganizer = user && event && event.organizer && event.organizer === user._id; // Assuming event.organizer is the organizer user ID
  const isAdmin = user?.role === 'admin';
  const canEdit = isOrganizer || isAdmin;


  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url(${event?.image || `https://source.unsplash.com/random?${event?.category}`})`,
          height: '400px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', p: 3 }}>
          <Grid container>
            <Grid item xs={12} md={8}>
              <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                {event.name}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Chip 
                  icon={<EventIcon />} 
                  label={formatDate(event.date)} 
                  sx={{ color: 'white', borderColor: 'white' }} 
                  variant="outlined" 
                />
                <Chip 
                  icon={<AccessTimeIcon />} 
                  label={event.time} 
                  sx={{ color: 'white', borderColor: 'white' }} 
                  variant="outlined" 
                />
                <Chip 
                  icon={<LocationOnIcon />} 
                  label={event.location} 
                  sx={{ color: 'white', borderColor: 'white' }} 
                  variant="outlined" 
                />
                <Chip 
                  icon={<CategoryIcon />}
                  label={event.category} 
                  color="secondary" 
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Edit Button (Visible to Organizer/Admin) */}
      {canEdit && (
         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate(`/events/edit/${event._id}`)}
            >
              Edit Event
            </Button>
         </Box>
      )}

      <Grid container spacing={4}>
        {/* Event Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              About This Event
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Event Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    <strong>Date:</strong> {formatDate(event.date)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    <strong>Time:</strong> {event.time}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOnIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    <strong>Location:</strong> {event.location}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ConfirmationNumberIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    <strong>Available Seats:</strong> {event.availableSeats}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Booking Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 24 }}>
            <Typography variant="h5" gutterBottom>
              Book Tickets
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" color="primary" gutterBottom>
                ${event.ticketPrice}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                per ticket
              </Typography>
            </Box>

            <TextField
              fullWidth
              type="number"
              label="Number of Seats"
              value={seats}
              onChange={handleSeatsChange}
              inputProps={{ min: 1, max: event.availableSeats }}
              sx={{ mb: 2 }}
            />

            <Typography variant="h6" gutterBottom>
              Total: ${(event.ticketPrice * seats).toFixed(2)}
            </Typography>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleBookTicket}
              disabled={!event.availableSeats}
              sx={{ mt: 2 }}
            >
              {event.availableSeats ? 'Book Now' : 'Sold Out'}
            </Button>

            {bookingError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {bookingError}
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Booking Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => !isBooking && setOpenDialog(false)}
        aria-labelledby="booking-dialog-title"
        aria-describedby="booking-dialog-description"
        keepMounted={false}
      >
        <DialogTitle id="booking-dialog-title">Confirm Booking</DialogTitle>
        <DialogContent>
          <DialogContentText id="booking-dialog-description">
            You are about to book {seats} ticket(s) for {event.name}.
            Total amount: ${(event.ticketPrice * seats).toFixed(2)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)} 
            disabled={isBooking}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmBooking} 
            variant="contained" 
            disabled={isBooking}
          >
            {isBooking ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={bookingSuccess}
        autoHideDuration={5000}
        onClose={() => setBookingSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Tickets booked successfully! Check your email for confirmation.
        </Alert>
      </Snackbar>

      <Snackbar
        open={bookingError !== null}
        autoHideDuration={5000}
        onClose={() => setBookingError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled">
          {bookingError}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EventDetailsPage;