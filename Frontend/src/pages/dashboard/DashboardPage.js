import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useAuth } from '../../context/AuthContext';
import ParticleBackground from '../../components/ParticleBackground';
import './DashboardPage.css';

const defaultAvatar = 'https://ui-avatars.com/api/?background=random';

// Customer Dashboard Component
const CustomerDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's tickets
        const ticketsResponse = await api.get('/tickets/my-tickets', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setTickets(ticketsResponse.data);

        // Fetch recommended events
        const eventsResponse = await api.get('/events/recommended', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setEvents(eventsResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching customer dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError('Please log in to view your dashboard');
      setLoading(false);
    }
  }, [token]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Customer Dashboard</Typography>
      
      {/* Upcoming Events Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Your Upcoming Events
            </Typography>
            {tickets.length > 0 ? (
              <List>
                {tickets.slice(0, 5).map((ticket) => (
                  <React.Fragment key={ticket._id}>
                    <ListItem
                      button
                      component={RouterLink}
                      to={`/tickets/${ticket._id}`}
                    >
                      <ListItemText
                        primary={ticket.event.name}
                        secondary={`Date: ${formatDate(ticket.event.date)} | Seats: ${ticket.seats}`}
                      />
                      <Chip
                        label={`$${ticket.event.ticketPrice * ticket.seats}`}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">
                You don't have any upcoming events. Browse events to book tickets!
              </Typography>
            )}
            <Button
              component={RouterLink}
              to="/my-tickets"
              variant="outlined"
              sx={{ mt: 2 }}
              fullWidth
            >
              View All Tickets
            </Button>
          </Paper>
        </Grid>

        {/* Recommended Events Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recommended Events
            </Typography>
            {events.length > 0 ? (
              <List>
                {events.slice(0, 5).map((event) => (
                  <React.Fragment key={event._id}>
                    <ListItem
                      button
                      component={RouterLink}
                      to={`/events/${event._id}`}
                    >
                      <ListItemText
                        primary={event.name}
                        secondary={`${formatDate(event.date)} | ${event.location}`}
                      />
                      <Chip
                        label={`$${event.ticketPrice}`}
                        color="secondary"
                        size="small"
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No recommended events available at the moment.
              </Typography>
            )}
            <Button
              component={RouterLink}
              to="/events"
              variant="outlined"
              sx={{ mt: 2 }}
              fullWidth
            >
              Browse All Events
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Organizer Dashboard Component
const OrganizerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch events based on user role
        if (user?.role === 'organizer') {
          const [eventsResponse, statsResponse] = await Promise.all([
            api.get('/events/my-events'),
            api.get('/events/stats')
          ]);
          setEvents(eventsResponse.data.events || []);
          setStats(statsResponse.data);
        } else if (user?.role === 'admin') {
          const [eventsResponse, statsResponse] = await Promise.all([
            api.get('/events'),
            api.get('/events/stats')
          ]);
          setEvents(eventsResponse.data.events || []);
          setStats(statsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      setError('Please log in to view this dashboard');
      setLoading(false);
    }
  }, [user]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Organizer Dashboard</Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Events
              </Typography>
              <Typography variant="h3">
                {stats?.totalEvents || 0}
              </Typography>
              <EventIcon color="primary" sx={{ fontSize: 40, opacity: 0.6, mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tickets Sold
              </Typography>
              <Typography variant="h3">
                {stats?.ticketsSold || 0}
              </Typography>
              <ConfirmationNumberIcon color="secondary" sx={{ fontSize: 40, opacity: 0.6, mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Revenue
              </Typography>
              <Typography variant="h3">
                ${stats?.totalRevenue?.toFixed(2) || '0.00'}
              </Typography>
              <AttachMoneyIcon color="success" sx={{ fontSize: 40, opacity: 0.6, mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg. Ticket Price
              </Typography>
              <Typography variant="h3">
                ${stats?.ticketsSold ? (stats.totalRevenue / stats.ticketsSold).toFixed(2) : '0.00'}
              </Typography>
              <AttachMoneyIcon color="info" sx={{ fontSize: 40, opacity: 0.6, mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Your Events Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Your Events</Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/events/create"
          >
            Create New Event
          </Button>
        </Box>
        
        {events.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Ticket Price</TableCell>
                  <TableCell>Available Seats</TableCell>
                  <TableCell>Tickets Sold</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => {
                  const eventStats = stats?.events?.find(e => e.id === event._id);
                  return (
                    <TableRow key={event._id}>
                      <TableCell>{event.name}</TableCell>
                      <TableCell>{formatDate(event.date)}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>${event.ticketPrice}</TableCell>
                      <TableCell>{event.availableSeats}/{event.totalSeats}</TableCell>
                      <TableCell>{eventStats?.ticketsSold || 0}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          component={RouterLink}
                          to={`/events/${event._id}`}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          component={RouterLink}
                          to={`/events/edit/${event._id}`}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="textSecondary">
            You haven't created any events yet. Create your first event to get started!
          </Typography>
        )}
      </Paper>
      
      {/* Recent Sales Section */}
      {stats?.recentSales && stats.recentSales.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Recent Sales</Typography>
          <List>
            {stats.recentSales.map((sale) => (
              <React.Fragment key={sale._id}>
                <ListItem>
                  <ListItemText
                    primary={`${sale.customer.name} purchased ${sale.seats} ticket(s) for ${sale.event.name}`}
                    secondary={`Purchase Date: ${new Date(sale.purchaseDate).toLocaleString()}`}
                  />
                  <Typography variant="body2" color="primary" fontWeight="bold">
                    ${sale.price}
                  </Typography>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

// Admin Dashboard Component
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch system statistics
        const statsResponse = await api.get('/admin/stats');
        setStats(statsResponse.data);

        // Fetch users
        const usersResponse = await api.get('/admin/users');
        setUsers(usersResponse.data);

        // Fetch events
        const eventsResponse = await api.get('/admin/events');
        setEvents(eventsResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h3">
                {stats?.totalUsers || 0}
              </Typography>
              <PeopleIcon color="primary" sx={{ fontSize: 40, opacity: 0.6, mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Events
              </Typography>
              <Typography variant="h3">
                {stats?.totalEvents || 0}
              </Typography>
              <EventIcon color="secondary" sx={{ fontSize: 40, opacity: 0.6, mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Tickets
              </Typography>
              <Typography variant="h3">
                {stats?.totalTickets || 0}
              </Typography>
              <ConfirmationNumberIcon color="success" sx={{ fontSize: 40, opacity: 0.6, mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h3">
                ${stats?.totalRevenue?.toFixed(2) || '0.00'}
              </Typography>
              <AttachMoneyIcon color="info" sx={{ fontSize: 40, opacity: 0.6, mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Recent Users Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Recent Users</Typography>
        {users.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(0, 5).map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={user.avatar || `${defaultAvatar}&name=${encodeURIComponent(user.name)}`}
                          alt={user.name}
                          sx={{ width: 32, height: 32, mr: 1 }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `${defaultAvatar}&name=${encodeURIComponent(user.name)}`;
                          }}
                        />
                        {user.name}
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={user.role === 'admin' ? 'error' : user.role === 'organizer' ? 'warning' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No users found.
          </Typography>
        )}
      </Paper>
      
      {/* Recent Events Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Recent Events</Typography>
        {events.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Organizer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Tickets Sold</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.slice(0, 5).map((event) => (
                  <TableRow key={event._id}>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>{event.organizer.name}</TableCell>
                    <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                    <TableCell>{event.totalSeats - event.availableSeats}/{event.totalSeats}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        component={RouterLink}
                        to={`/events/${event._id}`}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No events found.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

// Main Dashboard Component
const DashboardPage = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  let dashboardContent = null;
  if (user?.role === 'customer') {
    dashboardContent = <CustomerDashboard />;
  } else if (user?.role === 'organizer') {
    dashboardContent = <OrganizerDashboard />;
  } else if (user?.role === 'admin') {
    dashboardContent = <AdminDashboard />;
  }

  return (
    <Box className="dashboard-page">
      <Container>
        <Typography variant="h4" className="title">
          Dashboard
        </Typography>
        <Box className="content">
          {dashboardContent}
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage;