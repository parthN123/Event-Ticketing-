import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Divider,
  Link
} from '@mui/material';
import { motion } from 'framer-motion';
import AnimatedElement from '../components/animations/AnimatedElement';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';

const ContactUs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
      isValid = false;
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Your message has been sent successfully! We will get back to you soon.',
        severity: 'success'
      });
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
    
    // In a real application, you would make an API call here
    // try {
    //   const response = await axios.post('/api/contact', formData);
    //   setLoading(false);
    //   setSnackbar({
    //     open: true,
    //     message: response.data.message || 'Your message has been sent successfully! We will get back to you soon.',
    //     severity: 'success'
    //   });
    //   
    //   // Clear form
    //   setFormData({
    //     name: '',
    //     email: '',
    //     subject: '',
    //     message: ''
    //   });
    // } catch (error) {
    //   setLoading(false);
    //   setSnackbar({
    //     open: true,
    //     message: error.response?.data?.message || 'Failed to send message. Please try again later.',
    //     severity: 'error'
    //   });
    // }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Contact info items
  const contactItems = [
    {
      icon: <LocationOnIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Our Location',
      content: '123 Event Street, City Center, NY 10001, USA'
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Phone Number',
      content: '+1 (555) 123-4567'
    },
    {
      icon: <EmailIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Email Address',
      content: 'contact@eventify.com'
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Working Hours',
      content: 'Monday - Friday: 9AM - 5PM'
    }
  ];

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        py: { xs: 6, md: 10 },
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(to bottom, ${theme.palette.background.default}, ${theme.palette.background.paper})` 
          : `linear-gradient(to bottom, ${theme.palette.grey[50]}, ${theme.palette.background.paper})`
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <AnimatedElement animation="fadeInUp">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2" 
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Get In Touch
            </Typography>
            <Typography 
              variant="h6" 
              color="textSecondary"
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto',
                mb: 2
              }}
            >
              Have questions about our events or services? We're here to help! Fill out the form below and our team will get back to you as soon as possible.
            </Typography>
          </Box>
        </AnimatedElement>

        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <AnimatedElement animation="slideLeft" delay={0.2}>
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 2,
                  height: '100%',
                  background: theme.palette.mode === 'dark' 
                    ? `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[900]})` 
                    : `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[100]})`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Typography 
                  variant="h4" 
                  component="h2"
                  sx={{ 
                    mb: 3, 
                    fontWeight: 600,
                    color: theme.palette.text.primary
                  }}
                >
                  Send Us a Message
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        error={!!errors.subject}
                        helperText={errors.subject}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Your Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        error={!!errors.message}
                        helperText={errors.message}
                        required
                        multiline
                        rows={6}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={loading}
                        endIcon={<SendIcon />}
                        sx={{
                          mt: 2,
                          py: 1.5,
                          px: 4,
                          borderRadius: '50px',
                          fontWeight: 600,
                          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </AnimatedElement>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <AnimatedElement animation="slideRight" delay={0.3}>
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 2,
                  height: '100%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
                }}
              >
                <Typography 
                  variant="h4" 
                  component="h2"
                  sx={{ 
                    mb: 4, 
                    fontWeight: 600,
                    color: 'white'
                  }}
                >
                  Contact Information
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {contactItems.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          flexShrink: 0
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {item.content}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
                  Follow Us
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social, index) => (
                    <Link 
                      key={index} 
                      href="#" 
                      underline="none"
                      sx={{
                        display: 'inline-block',
                        color: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                          transform: 'translateY(-3px)'
                        }
                      }}
                    >
                      {social.charAt(0)}
                    </Link>
                  ))}
                </Box>
              </Paper>
            </AnimatedElement>
          </Grid>
        </Grid>

        {/* Map Section */}
        <AnimatedElement animation="fadeInUp" delay={0.4}>
          <Box sx={{ mt: 8, borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <Typography 
              variant="h4" 
              component="h2"
              sx={{ 
                textAlign: 'center', 
                mb: 4, 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Our Location
            </Typography>
            <Box 
              component="iframe" 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573036704!2d-73.98784492426385!3d40.75798657138946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1710349305985!5m2!1sen!2sus" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>
        </AnimatedElement>

        {/* FAQ Section */}
        <AnimatedElement animation="fadeInUp" delay={0.5}>
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              component="h2"
              sx={{ 
                mb: 2, 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography 
              variant="body1" 
              color="textSecondary"
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto',
                mb: 4
              }}
            >
              Can't find the answer you're looking for? Reach out to our customer support team.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              sx={{
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
              onClick={() => {
                const faqSection = document.getElementById('faq-section');
                if (faqSection) {
                  faqSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              View FAQs
            </Button>
          </Box>
        </AnimatedElement>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactUs;