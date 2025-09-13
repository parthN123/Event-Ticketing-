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
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Slider,
  Paper,
  Breadcrumbs,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Event as EventIcon,
  LocationOn as LocationOnIcon,
  AccessTime as AccessTimeIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Close as CloseIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import AnimatedElement from '../components/animations/AnimatedElement';
import EventImage from '../components/common/EventImage';
import heroPattern from '../assets/images/backgrounds/hero-pattern.svg';

const Events = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const eventsPerPage = 9;
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('date-desc');
  
  // Mobile filter drawer
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data);
        setFilteredEvents(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvents();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...events];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(event => 
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (category !== 'all') {
      result = result.filter(event => 
        event.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Apply price filter
    result = result.filter(event => 
      event.ticketPrice >= priceRange[0] && event.ticketPrice <= priceRange[1]
    );
    
    // Apply sorting
    switch (sortBy) {
      case 'date-asc':
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'date-desc':
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'price-asc':
        result.sort((a, b) => a.ticketPrice - b.ticketPrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.ticketPrice - a.ticketPrice);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    setFilteredEvents(result);
    setPage(1); // Reset to first page when filters change
  }, [events, searchTerm, category, priceRange, sortBy]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setPriceRange([0, 1000]);
    setSortBy('date-desc');
  };

  // Calculate pagination
  const indexOfLastEvent = page * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          color: '#fff',
          overflow: 'hidden',
          background: `url(${heroPattern}), ${theme.palette.background.gradient}`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <AnimatedElement animation="fadeIn">
            <Typography 
              component="h1" 
              variant="h3" 
              color="inherit" 
              gutterBottom
              sx={{ 
                fontWeight: 800,
                textAlign: 'center',
              }}
            >
              Discover Events
            </Typography>
          </AnimatedElement>
          
          <AnimatedElement animation="fadeIn" delay={0.2}>
            <Typography 
              variant="h6" 
              color="inherit" 
              paragraph 
              align="center"
              sx={{ 
                maxWidth: '800px',
                mx: 'auto',
                mb: 4,
                opacity: 0.9,
              }}
            >
              Find and book tickets for concerts, sports, theater, and more events near you.
            </Typography>
          </AnimatedElement>
          
          <AnimatedElement animation="slideUp" delay={0.3}>
            <Box 
              component="form" 
              sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                maxWidth: '700px',
                mx: 'auto',
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search events, venues, or cities"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: { 
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                  }
                }}
              />
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setFilterDrawerOpen(true)}
                  startIcon={<FilterListIcon />}
                  sx={{ 
                    borderRadius: 2,
                    whiteSpace: 'nowrap',
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  {isSmall ? 'Filter' : 'Filter Events'}
                </Button>
                
                <FormControl 
                  variant="outlined" 
                  sx={{ 
                    minWidth: { xs: 120, sm: 150 },
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                  }}
                >
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                    startAdornment={
                      <InputAdornment position="start">
                        <SortIcon />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="date-desc">Newest First</MenuItem>
                    <MenuItem value="date-asc">Oldest First</MenuItem>
                    <MenuItem value="price-asc">Price: Low to High</MenuItem>
                    <MenuItem value="price-desc">Price: High to Low</MenuItem>
                    <MenuItem value="name-asc">Name: A to Z</MenuItem>
                    <MenuItem value="name-desc">Name: Z to A</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </AnimatedElement>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Breadcrumbs */}
        <AnimatedElement animation="fadeIn">
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
            <Typography color="text.primary">Events</Typography>
          </Breadcrumbs>
        </AnimatedElement>
        
        {/* Active Filters */}
        {(searchTerm || category !== 'all' || priceRange[0] > 0 || priceRange[1] < 1000) && (
          <AnimatedElement animation="fadeIn">
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3, alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Active Filters:
              </Typography>
              
              {searchTerm && (
                <Chip 
                  label={`Search: ${searchTerm}`} 
                  onDelete={() => setSearchTerm('')}
                  size="small"
                  sx={{ borderRadius: 1 }}
                />
              )}
              
              {category !== 'all' && (
                <Chip 
                  label={`Category: ${category}`} 
                  onDelete={() => setCategory('all')}
                  size="small"
                  sx={{ borderRadius: 1 }}
                />
              )}
              
              {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                <Chip 
                  label={`Price: $${priceRange[0]} - $${priceRange[1]}`} 
                  onDelete={() => setPriceRange([0, 1000])}
                  size="small"
                  sx={{ borderRadius: 1 }}
                />
              )}
              
              <Button 
                variant="text" 
                size="small" 
                onClick={clearFilters}
                sx={{ ml: 'auto' }}
              >
                Clear All
              </Button>
            </Box>
          </AnimatedElement>
        )}
        
        {/* Results Summary */}
        <AnimatedElement animation="fadeIn">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" component="h2">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Found
            </Typography>
          </Box>
        </AnimatedElement>
        
        {/* Events Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 4 }}>{error}</Alert>
        ) : filteredEvents.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', my: 4 }}>
            <Typography variant="h6" gutterBottom>No events found</Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your filters or search terms to find events.
            </Typography>
            <Button variant="contained" onClick={clearFilters} sx={{ mt: 2 }}>
              Clear Filters
            </Button>
          </Paper>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {currentEvents.map((event, index) => (
                <Grid item key={event._id} xs={12} sm={6} md={4}>
                  <motion.div variants={itemVariants}>
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
                      <EventImage
                        event={event}
                        height={180}
                        alt={event.name}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                            {event.name}
                          </Typography>
                          <Chip
                            label={event.category}
                            size="small"
                            color="primary"
                            sx={{ 
                              borderRadius: 1,
                              fontWeight: 500,
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <EventIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(event.date)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            {event.time}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            {event.location}
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                        <Button
                          variant="contained"
                          size="small"
                          component={RouterLink}
                          to={`/events/${event._id}`}
                          sx={{ 
                            borderRadius: 1,
                            boxShadow: 'none',
                            '&:hover': {
                              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                            },
                          }}
                        >
                          View Details
                        </Button>
                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{ fontWeight: 'bold' }}
                        >
                          ${event.ticketPrice}
                        </Typography>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
        
        {/* Pagination */}
        {filteredEvents.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary"
              size={isMobile ? 'small' : 'medium'}
              showFirstButton 
              showLastButton
            />
          </Box>
        )}
      </Container>
      
      {/* Filter Drawer (Mobile) */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: { 
            width: { xs: '100%', sm: 400 },
            p: 3,
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2">
            Filter Events
          </Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <List disablePadding>
          <ListItem disablePadding sx={{ display: 'block', mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Category
            </Typography>
            <FormControl fullWidth variant="outlined" size="small">
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                displayEmpty
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="concert">Concert</MenuItem>
                <MenuItem value="sports">Sports</MenuItem>
                <MenuItem value="theater">Theater</MenuItem>
                <MenuItem value="conference">Conference</MenuItem>
                <MenuItem value="exhibition">Exhibition</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
          
          <ListItem disablePadding sx={{ display: 'block', mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Price Range
            </Typography>
            <Box sx={{ px: 1 }}>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                step={10}
                valueLabelFormat={(value) => `$${value}`}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  ${priceRange[0]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ${priceRange[1]}
                </Typography>
              </Box>
            </Box>
          </ListItem>
        </List>
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            fullWidth 
            onClick={clearFilters}
          >
            Clear All
          </Button>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={() => setFilterDrawerOpen(false)}
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default Events;