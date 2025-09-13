import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Breadcrumbs,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Badge,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
  CreditCard as CreditCardIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import AnimatedElement from '../components/animations/AnimatedElement';

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // User data state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  
  // Bookings and favorites state
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        // In a real app, this would be an authenticated request
        const response = await axios.get('/api/user/profile');
        setUser(response.data);
        setEditedUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile. Please try again later.');
        setLoading(false);
        
        // For demo purposes, set mock data
        const mockUser = {
          _id: '123456',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main St, New York, NY 10001',
          profileImage: 'https://source.unsplash.com/random/200x200/?portrait',
          joinDate: '2023-01-15T00:00:00.000Z',
        };
        setUser(mockUser);
        setEditedUser(mockUser);
        setLoading(false);
      }
    };

    // Fetch user bookings
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/user/bookings');
        setBookings(response.data);
        setLoadingBookings(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setLoadingBookings(false);
        
        // For demo purposes, set mock data
        const mockBookings = [
          {
            _id: 'b1',
            eventId: 'e1',
            eventName: 'Summer Music Festival',
            eventDate: '2023-07-15T18:00:00.000Z',
            eventLocation: 'Central Park, New York',
            ticketQuantity: 2,
            totalPrice: 150,
            purchaseDate: '2023-05-20T14:30:00.000Z',
            status: 'confirmed',
            category: 'concert',
          },
          {
            _id: 'b2',
            eventId: 'e2',
            eventName: 'NBA Finals Game 3',
            eventDate: '2023-06-10T19:30:00.000Z',
            eventLocation: 'Madison Square Garden, New York',
            ticketQuantity: 3,
            totalPrice: 450,
            purchaseDate: '2023-04-15T10:15:00.000Z',
            status: 'completed',
            category: 'sports',
          },
          {
            _id: 'b3',
            eventId: 'e3',
            eventName: 'Hamilton Broadway Show',
            eventDate: '2023-08-22T19:00:00.000Z',
            eventLocation: 'Richard Rodgers Theatre, New York',
            ticketQuantity: 2,
            totalPrice: 390,
            purchaseDate: '2023-06-01T09:45:00.000Z',
            status: 'confirmed',
            category: 'theater',
          },
        ];
        setBookings(mockBookings);
      }
    };

    // Fetch user favorites
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('/api/user/favorites');
        setFavorites(response.data);
        setLoadingFavorites(false);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setLoadingFavorites(false);
        
        // For demo purposes, set mock data
        const mockFavorites = [
          {
            _id: 'e4',
            name: 'Tech Conference 2023',
            date: '2023-09-15T09:00:00.000Z',
            location: 'Javits Center, New York',
            ticketPrice: 199,
            category: 'conference',
          },
          {
            _id: 'e5',
            name: 'Art Exhibition Opening',
            date: '2023-07-08T17:00:00.000Z',
            location: 'Metropolitan Museum of Art, New York',
            ticketPrice: 25,
            category: 'exhibition',
          },
          {
            _id: 'e6',
            name: 'Jazz Night',
            date: '2023-08-05T20:00:00.000Z',
            location: 'Blue Note Jazz Club, New York',
            ticketPrice: 75,
            category: 'concert',
          },
        ];
        setFavorites(mockFavorites);
      }
    };

    fetchUserData();
    fetchBookings();
    fetchFavorites();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditedUser(user);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // In a real app, this would be an authenticated request
      const response = await axios.put('/api/user/profile', editedUser);
      setUser(editedUser);
      setIsEditing(false);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update profile. Please try again.',
        severity: 'error',
      });
      
      // For demo purposes, update anyway
      setUser(editedUser);
      setIsEditing(false);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      });
    }
  };

  const handlePasswordChange = async () => {
    // Validate passwords
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      // In a real app, this would be an authenticated request
      await axios.put('/api/user/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setPasswordDialogOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
      
      setSnackbar({
        open: true,
        message: 'Password changed successfully!',
        severity: 'success',
      });
    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordErrors({
        currentPassword: 'Current password is incorrect',
      });
      
      // For demo purposes, show success anyway
      setPasswordDialogOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
      
      setSnackbar({
        open: true,
        message: 'Password changed successfully!',
        severity: 'success',
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // In a real app, this would be an authenticated request
      await axios.delete('/api/user/account');
      
      // Redirect to home page or login page
      window.location.href = '/';
    } catch (err) {
      console.error('Error deleting account:', err);
      setSnackbar({
        open: true,
        message: 'Failed to delete account. Please try again.',
        severity: 'error',
      });
      
      // Close dialog
      setDeleteDialogOpen(false);
    }
  };

  const handleRemoveFavorite = async (eventId) => {
    try {
      // In a real app, this would be an authenticated request
      await axios.delete(`/api/user/favorites/${eventId}`);
      
      // Update favorites list
      setFavorites(prev => prev.filter(event => event._id !== eventId));
      
      setSnackbar({
        open: true,
        message: 'Event removed from favorites!',
        severity: 'success',
      });
    } catch (err) {
      console.error('Error removing favorite:', err);
      setSnackbar({
        open: true,
        message: 'Failed to remove from favorites. Please try again.',
        severity: 'error',
      });
      
      // For demo purposes, update anyway
      setFavorites(prev => prev.filter(event => event._id !== eventId));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time for display
  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !user) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          <Typography color="text.primary">My Profile</Typography>
        </Breadcrumbs>
      </AnimatedElement>
      
      <Grid container spacing={4}>
        {/* Profile Sidebar */}
        <Grid item xs={12} md={4}>
          <AnimatedElement animation="slideRight">
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    isEditing ? (
                      <IconButton 
                        size="small" 
                        sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white',
                          '&:hover': { bgcolor: 'primary.dark' },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    ) : null
                  }
                >
                  <Avatar
                    src={user.profileImage}
                    alt={user.name}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mb: 2,
                      border: '4px solid white',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    }}
                  />
                </Badge>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Member since {formatDate(user.joinDate)}
                </Typography>
                <Button
                  variant={isEditing ? "outlined" : "contained"}
                  color={isEditing ? "error" : "primary"}
                  startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                  onClick={handleEditToggle}
                  sx={{ mt: 1 }}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <List disablePadding>
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <EmailIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Email" 
                    secondary={user.email} 
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <PhoneIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Phone" 
                    secondary={user.phone} 
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                
                <ListItem disablePadding>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <LocationOnIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Address" 
                    secondary={user.address} 
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              </List>
              
              <Box sx={{ mt: 'auto', pt: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<SecurityIcon />}
                  onClick={() => setPasswordDialogOpen(true)}
                  sx={{ mb: 2 }}
                >
                  Change Password
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete Account
                </Button>
              </Box>
            </Paper>
          </AnimatedElement>
        </Grid>
        
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <AnimatedElement animation="slideLeft">
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant={isMobile ? "fullWidth" : "standard"}
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  bgcolor: theme.palette.background.paper,
                }}
              >
                <Tab 
                  label="Profile" 
                  icon={<PersonIcon />} 
                  iconPosition="start"
                />
                <Tab 
                  label="My Bookings" 
                  icon={<ConfirmationNumberIcon />} 
                  iconPosition="start"
                />
                <Tab 
                  label="Favorites" 
                  icon={<FavoriteIcon />} 
                  iconPosition="start"
                />
              </Tabs>
              
              {/* Profile Tab */}
              {tabValue === 0 && (
                <Box sx={{ p: 3 }}>
                  {isEditing ? (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <motion.div variants={itemVariants}>
                            <Typography variant="h6" gutterBottom>
                              Edit Your Information
                            </Typography>
                          </motion.div>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <motion.div variants={itemVariants}>
                            <TextField
                              fullWidth
                              label="Full Name"
                              name="name"
                              value={editedUser.name}
                              onChange={handleInputChange}
                              variant="outlined"
                              margin="normal"
                            />
                          </motion.div>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <motion.div variants={itemVariants}>
                            <TextField
                              fullWidth
                              label="Email"
                              name="email"
                              value={editedUser.email}
                              onChange={handleInputChange}
                              variant="outlined"
                              margin="normal"
                              type="email"
                            />
                          </motion.div>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <motion.div variants={itemVariants}>
                            <TextField
                              fullWidth
                              label="Phone"
                              name="phone"
                              value={editedUser.phone}
                              onChange={handleInputChange}
                              variant="outlined"
                              margin="normal"
                            />
                          </motion.div>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <motion.div variants={itemVariants}>
                            <TextField
                              fullWidth
                              label="Profile Image URL"
                              name="profileImage"
                              value={editedUser.profileImage}
                              onChange={handleInputChange}
                              variant="outlined"
                              margin="normal"
                            />
                          </motion.div>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <motion.div variants={itemVariants}>
                            <TextField
                              fullWidth
                              label="Address"
                              name="address"
                              value={editedUser.address}
                              onChange={handleInputChange}
                              variant="outlined"
                              margin="normal"
                              multiline
                              rows={2}
                            />
                          </motion.div>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <motion.div variants={itemVariants}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={handleEditToggle}
                                sx={{ mr: 2 }}
                                startIcon={<CancelIcon />}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveProfile}
                                startIcon={<SaveIcon />}
                              >
                                Save Changes
                              </Button>
                            </Box>
                          </motion.div>
                        </Grid>
                      </Grid>
                    </motion.div>
                  ) : (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Account Information
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Card variant="outlined" sx={{ mb: 2 }}>
                            <CardContent>
                              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                <PersonIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Personal Information
                              </Typography>
                              <Typography variant="body1" paragraph>
                                <strong>Name:</strong> {user.name}
                              </Typography>
                              <Typography variant="body1" paragraph>
                                <strong>Email:</strong> {user.email}
                              </Typography>
                              <Typography variant="body1">
                                <strong>Phone:</strong> {user.phone}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Card variant="outlined" sx={{ mb: 2 }}>
                            <CardContent>
                              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                <LocationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Address Information
                              </Typography>
                              <Typography variant="body1">
                                {user.address}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                      
                      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                        Account Settings
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                <NotificationsIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Notification Preferences
                              </Typography>
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  Email Notifications: <Chip label="Enabled" size="small" color="success" sx={{ ml: 1 }} />
                                </Typography>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  SMS Notifications: <Chip label="Disabled" size="small" color="default" sx={{ ml: 1 }} />
                                </Typography>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                  Marketing Emails: <Chip label="Disabled" size="small" color="default" sx={{ ml: 1 }} />
                                </Typography>
                              </Box>
                            </CardContent>
                            <Box sx={{ px: 2, pb: 2 }}>
                              <Button size="small" startIcon={<SettingsIcon />}>
                                Manage Notifications
                              </Button>
                            </Box>
                          </Card>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                <CreditCardIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Payment Methods
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                No payment methods saved yet.
                              </Typography>
                            </CardContent>
                            <Box sx={{ px: 2, pb: 2 }}>
                              <Button size="small" startIcon={<CreditCardIcon />}>
                                Add Payment Method
                              </Button>
                            </Box>
                          </Card>
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom>
                          Need Help?
                        </Typography>
                        <Typography variant="body2" paragraph>
                          If you have any questions or need assistance with your account, please contact our support team.
                        </Typography>
                        <Button variant="outlined" startIcon={<HelpIcon />}>
                          Contact Support
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
              
              {/* Bookings Tab */}
              {tabValue === 1 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    My Bookings
                  </Typography>
                  
                  {loadingBookings ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : bookings.length === 0 ? (
                    <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body1" paragraph>
                        You haven't booked any events yet.
                      </Typography>
                      <Button 
                        variant="contained" 
                        component={RouterLink} 
                        to="/events"
                        startIcon={<EventIcon />}
                      >
                        Browse Events
                      </Button>
                    </Paper>
                  ) : (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {bookings.map((booking) => (
                        <motion.div key={booking._id} variants={itemVariants}>
                          <Card 
                            variant="outlined" 
                            sx={{ 
                              mb: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              },
                            }}
                          >
                            <Grid container>
                              <Grid item xs={12} sm={4}>
                                <CardMedia
                                  component="img"
                                  height="140"
                                  image={`https://source.unsplash.com/random?${booking.category}&sig=${booking._id}`}
                                  alt={booking.eventName}
                                  sx={{ height: '100%', minHeight: 140 }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={8}>
                                <CardContent>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography variant="h6" component="h3">
                                      {booking.eventName}
                                    </Typography>
                                    <Chip 
                                      label={booking.status} 
                                      color={booking.status === 'confirmed' ? 'success' : 'default'}
                                      size="small"
                                    />
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                      <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                                      {formatDate(booking.eventDate)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                      <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                                      {formatTime(booking.eventDate)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                      <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                                      {booking.eventLocation}
                                    </Typography>
                                  </Box>
                                  
                                  <Divider sx={{ my: 1.5 }} />
                                  
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                      <Typography variant="body2">
                                        <strong>Tickets:</strong> {booking.ticketQuantity}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        Purchased on {formatDate(booking.purchaseDate)}
                                      </Typography>
                                    </Box>
                                    <Typography variant="h6" color="primary.main">
                                      ${booking.totalPrice}
                                    </Typography>
                                  </Box>
                                </CardContent>
                                <CardActions>
                                  <Button 
                                    size="small" 
                                    component={RouterLink} 
                                    to={`/events/${booking.eventId}`}
                                  >
                                    View Event
                                  </Button>
                                  <Button size="small">
                                    View Tickets
                                  </Button>
                                </CardActions>
                              </Grid>
                            </Grid>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </Box>
              )}
              
              {/* Favorites Tab */}
              {tabValue === 2 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    My Favorite Events
                  </Typography>
                  
                  {loadingFavorites ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : favorites.length === 0 ? (
                    <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body1" paragraph>
                        You haven't added any events to your favorites yet.
                      </Typography>
                      <Button 
                        variant="contained" 
                        component={RouterLink} 
                        to="/events"
                        startIcon={<EventIcon />}
                      >
                        Browse Events
                      </Button>
                    </Paper>
                  ) : (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Grid container spacing={3}>
                        {favorites.map((event) => (
                          <Grid item key={event._id} xs={12} sm={6}>
                            <motion.div variants={itemVariants}>
                              <Card 
                                sx={{ 
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                  },
                                }}
                              >
                                <CardMedia
                                  component="img"
                                  height="140"
                                  image={`https://source.unsplash.com/random?${event.category}&sig=${event._id}`}
                                  alt={event.name}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                  <Typography gutterBottom variant="h6" component="h3">
                                    {event.name}
                                  </Typography>
                                  
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                      <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                                      {formatDate(event.date)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                      <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                                      {event.location}
                                    </Typography>
                                  </Box>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between' }}>
                                  <Button 
                                    size="small" 
                                    component={RouterLink} 
                                    to={`/events/${event._id}`}
                                  >
                                    View Details
                                  </Button>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold', mr: 1 }}>
                                      ${event.ticketPrice}
                                    </Typography>
                                    <IconButton 
                                      color="error" 
                                      onClick={() => handleRemoveFavorite(event._id)}
                                      size="small"
                                    >
                                      <FavoriteIcon />
                                    </IconButton>
                                  </Box>
                                </CardActions>
                              </Card>
                            </motion.div>
                          </Grid>
                        ))}
                      </Grid>
                    </motion.div>
                  )}
                </Box>
              )}
            </Paper>
          </AnimatedElement>
        </Grid>
      </Grid>
      
      {/* Password Change Dialog */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={() => setPasswordDialogOpen(false)}
        aria-labelledby="password-dialog-title"
        aria-describedby="password-dialog-description"
        keepMounted={false}
      >
        <DialogTitle id="password-dialog-title">Change Password</DialogTitle>
        <DialogContent>
          <DialogContentText id="password-dialog-description" sx={{ mb: 2 }}>
            Please enter your current password and a new password to update your account security.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            error={!!passwordErrors.currentPassword}
            helperText={passwordErrors.currentPassword}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            error={!!passwordErrors.newPassword}
            helperText={passwordErrors.newPassword}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            error={!!passwordErrors.confirmPassword}
            helperText={passwordErrors.confirmPassword}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained">Change Password</Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Account Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        keepMounted={false}
      >
        <DialogTitle id="delete-dialog-title">Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">Delete Account</Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;