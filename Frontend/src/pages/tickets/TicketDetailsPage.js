import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import api from '../../config/axios';
import { useAuth } from '../../context/AuthContext';
import QRCode from 'react-qr-code';
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
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PrintIcon from '@mui/icons-material/Print';

const TicketDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!isAuthenticated) {
          setError('Please log in to view ticket details');
          setLoading(false);
          return;
        }

        // Check if we have a recently booked ticket in localStorage
        const lastBookedTicket = localStorage.getItem('lastBookedTicket');
        if (lastBookedTicket) {
          const ticketData = JSON.parse(lastBookedTicket);
          if (ticketData._id === id) {
            setTicket(ticketData);
            setLoading(false);
            // Clear the stored ticket data
            localStorage.removeItem('lastBookedTicket');
            return;
          }
        }

        const response = await api.get(`/tickets/${id}`);
        setTicket(response.data);
      } catch (err) {
        console.error('Error fetching ticket details:', err);
        if (err.response?.status === 401) {
          setError('Please log in to view ticket details');
        } else if (err.response?.status === 403) {
          setError('You are not authorized to view this ticket');
        } else if (err.response?.status === 404) {
          setError('Ticket not found');
        } else {
          setError('Failed to load ticket details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id, isAuthenticated]);

  const generateQRValue = () => {
    if (!ticket || !ticket._id) {
      console.log('Ticket or Ticket ID not available for QR code.', { ticket });
      return '';
    }
    const baseUrl = window.location.origin;
    return `${baseUrl}/tickets/${ticket._id}`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format purchase date
  const formatPurchaseDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handlePrint = () => {
    window.print();
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
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!ticket) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">Ticket not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Ticket Details
          </Typography>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print Ticket
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {ticket.cancelled && (
          <Alert severity="error" sx={{ mb: 3 }}>
            This ticket has been cancelled and is no longer valid.
          </Alert>
        )}
        
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* Ticket QR Code */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              p: { xs: 1.5, sm: 2 },
              textAlign: 'center'
            }}>
              {ticket && ticket._id ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mb: 2,
                  p: 1,
                  backgroundColor: 'white',
                  borderRadius: 1
                }}>
                  <QRCode
                    value={generateQRValue()}
                    size={isSmallMobile ? 150 : isMobile ? 180 : Math.min(window.innerWidth * 0.3, 200)}
                    level="H"
                    style={{
                      height: 'auto',
                      maxWidth: '100%',
                      width: '100%'
                    }}
                  />
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  QR Code not available or ticket ID is missing.
                </Typography>
              )}
              <Typography 
                variant="body2" 
                color="text.secondary" 
                align="center" 
                sx={{ 
                  mt: 1, 
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  px: 1
                }}
              >
                Scan this QR code at the event entrance
              </Typography>
              <Typography 
                variant={isSmallMobile ? "body1" : "h6"} 
                align="center" 
                sx={{ 
                  mt: 1,
                  fontSize: { xs: '0.9rem', sm: '1.25rem' },
                  fontWeight: 'bold'
                }}
              >
                Ticket ID: {ticket?._id?.substring(0, 8) || 'N/A'}
              </Typography>
            </Card>
          </Grid>
          
          {/* Ticket Details */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant={isSmallMobile ? "h6" : "h5"} 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    lineHeight: 1.2,
                    mb: 2
                  }}
                >
                  {ticket.event.name}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: { xs: 'flex-start', sm: 'center' }, 
                  mb: 2,
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 0.5, sm: 0 } }}>
                    <EventIcon sx={{ mr: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                      <strong>Date:</strong> {formatDate(ticket.event.date)}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: { xs: 'flex-start', sm: 'center' }, 
                  mb: 2,
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 0.5, sm: 0 } }}>
                    <AccessTimeIcon sx={{ mr: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                      <strong>Time:</strong> {ticket.event.time}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: { xs: 'flex-start', sm: 'center' }, 
                  mb: 2,
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 0.5, sm: 0 } }}>
                    <LocationOnIcon sx={{ mr: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                      <strong>Location:</strong> {ticket.event.location}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: { xs: 'flex-start', sm: 'center' }, 
                  mb: 2,
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 0.5, sm: 0 } }}>
                    <ConfirmationNumberIcon sx={{ mr: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                      <strong>Seats:</strong> {ticket.seats}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Typography variant="body1" sx={{ 
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    mb: 1
                  }}>
                    <strong>Purchase Date:</strong> {formatPurchaseDate(ticket.createdAt)}
                  </Typography>
                  <Typography 
                    variant={isSmallMobile ? "body1" : "h6"} 
                    color="primary"
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      fontWeight: 'bold'
                    }}
                  >
                    <strong>Total Amount:</strong> ${(ticket.event.ticketPrice * ticket.seats).toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          component={RouterLink}
          to="/my-tickets"
        >
          Back to My Tickets
        </Button>
        
        <Button
          variant="contained"
          component={RouterLink}
          to={`/events/${ticket.event._id}`}
        >
          View Event
        </Button>
      </Box>
    </Container>
  );
};

export default TicketDetailsPage;