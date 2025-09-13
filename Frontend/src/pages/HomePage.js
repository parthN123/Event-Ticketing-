import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import api from '../config/axios';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CategoryIcon from '@mui/icons-material/Category';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import EventImage from '../components/common/EventImage';
import './HomePage.css';

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setCategories] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        const response = await api.get('/events');
        const events = response.data.events || [];
        setFeaturedEvents(events.slice(0, 3)); // Get first 3 events as featured
      } catch (err) {
        console.error('Error fetching featured events:', err);
        setError('Failed to fetch featured events');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        if (response.data && Array.isArray(response.data.events)) {
          // Get the most recent events for the featured section
          const sortedEvents = [...response.data.events].sort((a, b) => new Date(b.date) - new Date(a.date));
          setFeaturedEvents(sortedEvents.slice(0, 6));
          
          // Extract unique categories
          const uniqueCategories = [...new Set(response.data.events.map(event => event.category))];
          setCategories(uniqueCategories);
          
          setLoading(false);
        } else {
          console.error('Unexpected response format:', response.data);
          setError('Invalid data format received from server');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Category icons mapping
  const categoryIcons = {
    music: MusicNoteIcon,
    sports: SportsSoccerIcon,
    arts: TheaterComedyIcon, // Using theater icon for arts as a placeholder
    food: CategoryIcon, // Placeholder icon
    technology: CategoryIcon, // Placeholder icon
    business: CategoryIcon, // Placeholder icon
    other: CategoryIcon, // Placeholder icon
    default: CategoryIcon,
  };

  // Get icon for category
  const getCategoryIcon = (category) => {
    const lowerCategory = category?.toLowerCase();
    return categoryIcons[lowerCategory] || categoryIcons.default;
  };

  return (
    <Box className="home-page">
      <Container>
        <Box className="hero-section" sx={{ textAlign: 'center', py: { xs: 4, md: 8 } }}>
          <Typography 
            variant={isSmallMobile ? "h3" : isMobile ? "h2" : "h1"} 
            className="title"
            sx={{ mb: 2, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
          >
            Welcome to Event Ticketing
          </Typography>
          <Typography 
            variant={isSmallMobile ? "h6" : "h5"} 
            className="subtitle"
            sx={{ mb: 4, fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            Discover and book tickets for the best events around you.
          </Typography>
          <Button
            component={RouterLink}
            to="/events"
            variant="contained"
            color="primary"
            size={isSmallMobile ? "medium" : "large"}
            className="cta-button"
            sx={{ 
              px: { xs: 3, sm: 4 },
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            Explore Events
          </Button>
        </Box>

        {/* Featured Events Section */}
        <Box sx={{ mt: { xs: 4, md: 8 } }}>
          <Typography 
            variant={isSmallMobile ? "h5" : "h4"} 
            gutterBottom 
            className="featured-events-title"
            sx={{ textAlign: 'center', mb: 4, fontSize: { xs: '1.5rem', sm: '2rem' } }}
          >
            Featured Events
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ textAlign: 'center' }}>
              {error}
            </Alert>
          ) : featuredEvents.length > 0 ? (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {featuredEvents.map((event) => {
                const IconComponent = getCategoryIcon(event.category);
                return (
                  <Grid item key={event._id} xs={12} sm={6} md={4}>
                    <Card className="event-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <EventImage
                        event={event}
                        height={isSmallMobile ? 120 : 140}
                        alt={event.name}
                      />
                      <CardContent>
                         <Chip
                            icon={<IconComponent />}
                            label={event.category}
                            size="small"
                            color="primary"
                            sx={{ mb: 1 }}
                          />
                        <Typography gutterBottom variant="h5" component="div">
                          {event.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <EventIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                          {formatDate(event.date)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <LocationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                          {event.location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                          {event.time}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                           <ConfirmationNumberIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                           Tickets from ${event.ticketPrice}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" component={RouterLink} to={`/events/${event._id}`}>
                          Learn More
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Typography>No featured events available at the moment.</Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;