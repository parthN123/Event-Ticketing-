import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import EventImage from '../../components/common/EventImage';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const eventsPerPage = 9;
  const [, setImageDataMap] = useState({});
  
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        // Check if response.data has the expected structure
        if (response.data && Array.isArray(response.data.events)) {
          setEvents(response.data.events);
          // Extract unique categories
          const uniqueCategories = [...new Set(response.data.events.map(event => event.category))];
          setCategories(uniqueCategories);
          
          // Fetch image data for all events with images
          const imagePromises = response.data.events
            .filter(event => event.image)
            .map(async event => {
              try {
                const imageResponse = await axios.get(event.image);
                return { id: event._id, imageData: imageResponse.data.imageData };
              } catch (err) {
                console.error(`Error fetching image for event ${event._id}:`, err);
                return null;
              }
            });

          const imageResults = await Promise.all(imagePromises);
          const newImageDataMap = {};
          imageResults.forEach(result => {
            if (result) {
              newImageDataMap[result.id] = result.imageData;
            }
          });
          setImageDataMap(newImageDataMap);
        } else {
          console.error('Unexpected response format:', response.data);
          setError('Invalid data format received from server');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter and sort events
    let result = [...events];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(event => 
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (category !== 'all') {
      result = result.filter(event => event.category === category);
    }
    
    // Sort events
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'price-low') {
        return a.ticketPrice - b.ticketPrice;
      } else if (sortBy === 'price-high') {
        return b.ticketPrice - a.ticketPrice;
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
    
    setFilteredEvents(result);
  }, [events, searchTerm, category, sortBy]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Category icons mapping (reuse from HomePage or define new if needed)
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const displayedEvents = filteredEvents.slice(
    (page - 1) * eventsPerPage,
    page * eventsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <Container maxWidth="lg" sx={{ mt: 4 }} className="events-page-container">
      <Typography 
        variant={isSmallMobile ? "h5" : "h4"} 
        component="h1" 
        gutterBottom
        sx={{ textAlign: { xs: 'center', sm: 'left' }, mb: 3 }}
      >
        Browse Events
      </Typography>

      {/* Filters and Search */}
      <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Search Events"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size={isSmallMobile ? "small" : "medium"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize={isSmallMobile ? "small" : "medium"} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size={isSmallMobile ? "small" : "medium"}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size={isSmallMobile ? "small" : "medium"}>
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="date">Date (Upcoming)</MenuItem>
              <MenuItem value="price-low">Price (Low to High)</MenuItem>
              <MenuItem value="price-high">Price (High to Low)</MenuItem>
              <MenuItem value="name">Name (A-Z)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Events Grid */}
      {displayedEvents.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">No events found matching your criteria.</Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => {
              setSearchTerm('');
              setCategory('all');
              setSortBy('date');
            }}
          >
            Clear Filters
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {displayedEvents.map((event) => {
              const IconComponent = getCategoryIcon(event.category);
              return (
                <Grid item key={event._id} xs={12} sm={6} md={4} className="event-card-item">
                  <Card
                    className="event-card-hover"
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <EventImage
                      event={event}
                      height={isSmallMobile ? 120 : 140}
                      alt={event.name}
                      sx={{ className: "event-card-image" }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
                      <Chip
                        icon={<IconComponent fontSize="small" />}
                        label={event.category}
                        size="small"
                        color="primary"
                        className="event-category-chip"
                        sx={{ mb: 1, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                      />
                      <Typography 
                        gutterBottom 
                        variant={isSmallMobile ? "h6" : "h5"} 
                        component="h2"
                        sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, lineHeight: 1.2 }}
                      >
                        {event.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EventIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(event.date)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.time}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.location}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" color="primary">
                          ${event.ticketPrice}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        component={RouterLink}
                        to={`/events/${event._id}`}
                      >
                        Learn More
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default EventsPage;