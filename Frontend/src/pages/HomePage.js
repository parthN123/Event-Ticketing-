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
  Paper,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  Avatar,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CategoryIcon from '@mui/icons-material/Category';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import SearchIcon from '@mui/icons-material/Search';
import './HomePage.css';

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [eventsPerPage, setEventsPerPage] = useState(9);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [imageDataMap, setImageDataMap] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
        <Box className="hero-section">
          <Typography variant="h1" className="title">
            Welcome to Event Ticketing
          </Typography>
          <Typography variant="h5" className="subtitle">
            Discover and book tickets for the best events around you.
          </Typography>
          <Button
            component={RouterLink}
            to="/events"
            variant="contained"
            color="primary"
            size="large"
            className="cta-button"
          >
            Explore Events
          </Button>
        </Box>

        {/* Featured Events Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" gutterBottom className="featured-events-title">
            Featured Events
          </Typography>
          {loading ? (
            <Typography>Loading events...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : featuredEvents.length > 0 ? (
            <Grid container spacing={3}>
              {featuredEvents.map((event) => {
                const IconComponent = getCategoryIcon(event.category);
                return (
                  <Grid item key={event._id} xs={12} sm={6} md={4}>
                    <Card className="event-card">
                      <CardMedia
                        component="img"
                        height="140"
                        image={event.image || `https://source.unsplash.com/random?${event.category}`}
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