import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  useMediaQuery,
  IconButton,
  Breadcrumbs,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationOnIcon,
  AccessTime as AccessTimeIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
  Category as CategoryIcon,
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedElement from '../components/animations/AnimatedElement';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvent();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleQuantityChange = (event) => {
    setTicketQuantity(event.target.value);
  };

  const handleBookTicket = async () => {
    try {
      // In a real app, this would be an API call to book tickets
      // await axios.post('/api/bookings', { eventId: id, quantity: ticketQuantity });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBookingSuccess(true);
      // Reset after 5 seconds
      setTimeout(() => setBookingSuccess(false), 5000);
    } catch (err) {
      console.error('Error booking tickets:', err);
      setBookingError('Failed to book tickets. Please try again.');
      // Reset after 5 seconds
      setTimeout(() => setBookingError(null), 5000);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, this would save to user's favorites in the database
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    if (navigator.share) {
      navigator.share({
        title: event?.name,
        text: `Check out this event: ${event?.name}`,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading event details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/events')} 
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs Navigation */}
        <AnimatedElement animation="fadeIn" delay={0.1}>
          <Breadcrumbs sx={{ mb: 3 }}>
            <Typography 
              component={RouterLink} 
              to="/"
              color="inherit"
              sx={{ 
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' } 
              }}
            >
              Home
            </Typography>
            <Typography 
              component={RouterLink} 
              to="/events"
              color="inherit"
              sx={{ 
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' } 
              }}
            >
              Events
            </Typography>
            <Typography color="text.primary">{event?.name}</Typography>
          </Breadcrumbs>
        </AnimatedElement>

        <Grid container spacing={4}>
          {/* Event Image and Details */}
          <Grid item xs={12} md={8}>
            <AnimatedElement animation="fadeIn" delay={0.2}>
              <Card sx={{ 
                mb: 4, 
                overflow: 'hidden',
                borderRadius: 2,
                boxShadow: theme.shadows[3],
              }}>
                <CardMedia
                  component="img"
                  height="400"
                  image={`https://source.unsplash.com/random?${event?.category}`}
                  alt={event?.name}
                  sx={{
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                      {event?.name}
                    </Typography>
                    <Box>
                      <IconButton 
                        onClick={toggleFavorite} 
                        color="primary"
                        sx={{ mr: 1 }}
                      >
                        {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                      </IconButton>
                      <IconButton onClick={handleShare} color="primary">
                        <ShareIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                    <Chip 
                      icon={<CategoryIcon />} 
                      label={event?.category} 
                      color="primary" 
                      sx={{ borderRadius: 1 }}
                    />
                    <Chip 
                      icon={<EventIcon />} 
                      label={formatDate(event?.date)} 
                      variant="outlined" 
                      sx={{ borderRadius: 1 }}
                    />
                    <Chip 
                      icon={<AccessTimeIcon />} 
                      label={event?.time} 
                      variant="outlined" 
                      sx={{ borderRadius: 1 }}
                    />
                    <Chip 
                      icon={<LocationOnIcon />} 
                      label={event?.location} 
                      variant="outlined" 
                      sx={{ borderRadius: 1 }}
                    />
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    About This Event
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {event?.description || 'No description available for this event.'}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Donec in efficitur ipsum, in egestas libero. Aliquam erat volutpat. Fusce bibendum augue ut odio finibus, at aliquet elit vestibulum.
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Phasellus eget enim eu lectus faucibus vestibulum. Suspendisse sodales pellentesque elementum. Morbi fermentum dui sit amet libero iaculis, ac fringilla risus elementum.
                  </Typography>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Event Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        <EventIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Date
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {formatDate(event?.date)}
                      </Typography>
                      
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Time
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {event?.time}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Location
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {event?.location}
                      </Typography>
                      
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        <ConfirmationNumberIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Ticket Price
                      </Typography>
                      <Typography variant="body1" paragraph>
                        ${event?.ticketPrice} per person
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </AnimatedElement>
          </Grid>
          
          {/* Booking Form */}
          <Grid item xs={12} md={4}>
            <AnimatedElement animation="slideIn" delay={0.4}>
              <Card sx={{ 
                position: 'sticky', 
                top: 100, 
                borderRadius: 2,
                boxShadow: theme.shadows[3],
                overflow: 'hidden',
              }}>
                <Box sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'primary.contrastText',
                  p: 2,
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Book Tickets
                  </Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 700 }}>
                    ${event?.ticketPrice} <Typography component="span" variant="body2">per ticket</Typography>
                  </Typography>
                  
                  <Box sx={{ my: 3 }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="ticket-quantity-label">Quantity</InputLabel>
                      <Select
                        labelId="ticket-quantity-label"
                        value={ticketQuantity}
                        onChange={handleQuantityChange}
                        label="Quantity"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <MenuItem key={num} value={num}>{num}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1">Price ({ticketQuantity} tickets)</Typography>
                      <Typography variant="body1">${(event?.ticketPrice * ticketQuantity).toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1">Service Fee</Typography>
                      <Typography variant="body1">${(event?.ticketPrice * ticketQuantity * 0.1).toFixed(2)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Total</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        ${(event?.ticketPrice * ticketQuantity * 1.1).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleBookTicket}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 2,
                      background: theme.palette.background.gradient,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                      '&:hover': {
                        boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Book Now
                  </Button>
                  
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                    Secure checkout • Instant confirmation
                  </Typography>
                </CardContent>
              </Card>
            </AnimatedElement>
          </Grid>
        </Grid>
        
        {/* Related Events Section */}
        <Box sx={{ mt: 8 }}>
          <AnimatedElement animation="fadeIn" delay={0.6}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              You Might Also Like
            </Typography>
            <Divider sx={{ mb: 4 }} />
            
            <Grid container spacing={4}>
              {/* This would typically be populated with actual related events */}
              {[1, 2, 3].map((item) => (
                <Grid item key={item} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                      },
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={`https://source.unsplash.com/random?event&sig=${item}`}
                      alt="Related Event"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h3">
                        Related Event {item}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EventIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(Date.now() + item * 86400000).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" color="text.secondary">
                          Venue {item}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardContent sx={{ pt: 0 }}>
                      <Button 
                        size="small" 
                        component={RouterLink} 
                        to={`/events/${item}`}
                        sx={{ 
                          fontWeight: 600,
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AnimatedElement>
        </Box>
      </Container>
      
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
    </Box>
  );
};

export default EventDetail;