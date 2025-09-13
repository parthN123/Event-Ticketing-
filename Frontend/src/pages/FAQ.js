import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Button,
  Divider,
  useTheme,
  Paper,
  Chip,
  Grid
} from '@mui/material';
import { motion } from 'framer-motion';
import AnimatedElement from '../components/animations/AnimatedElement';
import { Link as RouterLink } from 'react-router-dom';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SecurityIcon from '@mui/icons-material/Security';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SupportIcon from '@mui/icons-material/Support';

const FAQ = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

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

  // FAQ categories
  const categories = [
    { id: 'all', label: 'All Questions', icon: <HelpOutlineIcon /> },
    { id: 'account', label: 'Account', icon: <AccountCircleIcon /> },
    { id: 'events', label: 'Events', icon: <EventIcon /> },
    { id: 'payments', label: 'Payments', icon: <PaymentIcon /> },
    { id: 'security', label: 'Security', icon: <SecurityIcon /> },
    { id: 'support', label: 'Support', icon: <SupportIcon /> }
  ];

  // FAQ data
  const faqData = [
    {
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Creating an account is easy! Click on the "Sign Up" button in the top right corner of the homepage. Fill in your details including name, email address, and password. Verify your email address through the confirmation link we send you, and you\'re all set to start exploring events!'
    },
    {
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'If you\'ve forgotten your password, click on the "Login" button, then select "Forgot Password". Enter the email address associated with your account, and we\'ll send you instructions to reset your password. Follow the link in the email to create a new password.'
    },
    {
      category: 'account',
      question: 'Can I change my email address?',
      answer: 'Yes, you can change your email address in your account settings. Log in to your account, go to your profile page, and click on "Edit Profile". Update your email address and save the changes. You\'ll need to verify your new email address before the change takes effect.'
    },
    {
      category: 'events',
      question: 'How do I find events near me?',
      answer: 'Our platform automatically shows events based on your location. You can also use the search filters to specify a city or distance radius. On the Events page, use the location filter to enter your city or postal code, and adjust the distance slider to find events within your preferred travel range.'
    },
    {
      category: 'events',
      question: 'Can I organize my own event?',
      answer: 'Absolutely! We welcome event organizers of all types. Click on "Organize Event" in the navigation menu to get started. You\'ll need to provide details about your event, including date, time, location, description, and ticket information. Once submitted, our team will review your event before it goes live on the platform.'
    },
    {
      category: 'events',
      question: 'How do I cancel my registration for an event?',
      answer: 'To cancel your registration, go to your profile and navigate to "My Tickets". Find the event you wish to cancel and click on "Cancel Registration". Please note that refund policies vary by event and are set by the event organizer. Check the event\'s refund policy before canceling.'
    },
    {
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, and in some regions, Apple Pay and Google Pay. The available payment methods will be displayed during the checkout process.'
    },
    {
      category: 'payments',
      question: 'How do refunds work?',
      answer: 'Refund policies are set by event organizers and vary by event. You can find the refund policy on each event\'s details page. If you\'re eligible for a refund, it will typically be processed back to your original payment method within 5-10 business days.'
    },
    {
      category: 'payments',
      question: 'Is my payment information secure?',
      answer: 'Yes, we take security very seriously. All payment information is encrypted using industry-standard SSL technology. We don\'t store your full credit card details on our servers. Our payment processing complies with PCI DSS (Payment Card Industry Data Security Standard) requirements.'
    },
    {
      category: 'security',
      question: 'How is my personal information protected?',
      answer: 'We implement robust security measures to protect your personal information. This includes encryption, secure servers, regular security audits, and strict access controls. We only collect information necessary for providing our services and never sell your personal data to third parties. For more details, please review our Privacy Policy.'
    },
    {
      category: 'security',
      question: 'What should I do if I notice suspicious activity on my account?',
      answer: 'If you notice any suspicious activity, immediately change your password and contact our support team. We recommend enabling two-factor authentication for an extra layer of security. You can report suspicious activity through the "Help & Support" section in your account or by emailing security@eventify.com.'
    },
    {
      category: 'support',
      question: 'How can I contact customer support?',
      answer: 'You can reach our customer support team through multiple channels. Use the "Contact Us" page on our website, email us at support@eventify.com, or use the live chat feature available on the bottom right of every page. Our support team is available 24/7 to assist you with any questions or issues.'
    },
    {
      category: 'support',
      question: 'What are your customer support hours?',
      answer: 'Our customer support team is available 24 hours a day, 7 days a week. We\'re here to help you whenever you need assistance, regardless of your time zone.'
    }
  ];

  // Filter FAQs based on search term and active category
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

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
      id="faq-section"
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
              Frequently Asked Questions
            </Typography>
            <Typography 
              variant="h6" 
              color="textSecondary"
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto',
                mb: 4
              }}
            >
              Find answers to common questions about our platform, events, payments, and more
            </Typography>
          </Box>
        </AnimatedElement>

        {/* Search Bar */}
        <AnimatedElement animation="fadeInUp" delay={0.1}>
          <Box sx={{ maxWidth: '600px', mx: 'auto', mb: 6 }}>
            <TextField
              fullWidth
              placeholder="Search for questions..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '50px',
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: '0 4px 14px 0 rgba(0,0,0,0.05)',
                  '& fieldset': {
                    borderColor: 'transparent'
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent !important'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: `${theme.palette.primary.main} !important`
                  }
                }
              }}
            />
          </Box>
        </AnimatedElement>

        {/* Category Filters */}
        <AnimatedElement animation="fadeInUp" delay={0.2}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              flexWrap: 'wrap', 
              gap: 2, 
              mb: 6 
            }}
          >
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.label}
                icon={category.icon}
                onClick={() => handleCategoryChange(category.id)}
                color={activeCategory === category.id ? 'primary' : 'default'}
                variant={activeCategory === category.id ? 'filled' : 'outlined'}
                sx={{
                  borderRadius: '50px',
                  px: 1,
                  '& .MuiChip-label': {
                    px: 1,
                    fontWeight: 500
                  },
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Box>
        </AnimatedElement>

        {/* FAQ Accordions */}
        <Box sx={{ mb: 8 }}>
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <AnimatedElement key={index} animation="fadeInUp" delay={0.1 * index}>
                <Accordion
                  sx={{
                    mb: 2,
                    borderRadius: '8px !important',
                    overflow: 'hidden',
                    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.05)',
                    '&:before': {
                      display: 'none'
                    },
                    '&.Mui-expanded': {
                      boxShadow: '0 8px 24px 0 rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: theme.palette.background.paper,
                      '& .MuiAccordionSummary-content': {
                        display: 'flex',
                        alignItems: 'center'
                      }
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: theme.palette.background.default }}>
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.7 }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </AnimatedElement>
            ))
          ) : (
            <AnimatedElement animation="fadeInUp">
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  No results found for "{searchTerm}"
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                  Try adjusting your search or browse all categories
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                  }}
                  sx={{ borderRadius: '50px', px: 3 }}
                >
                  View All FAQs
                </Button>
              </Paper>
            </AnimatedElement>
          )}
        </Box>

        {/* Still Have Questions Section */}
        <AnimatedElement animation="fadeInUp">
          <Paper
            elevation={6}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="h4" 
              component="h2"
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                color: 'white'
              }}
            >
              Still Have Questions?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4,
                maxWidth: '800px',
                mx: 'auto',
                color: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              Our support team is here to help you with any questions or issues you might have
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    height: '100%',
                    transition: 'transform 0.3s ease, background-color 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)'
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Contact Support
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
                    Get in touch with our customer support team
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/contact-us"
                    variant="contained"
                    sx={{
                      backgroundColor: 'white',
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)'
                      },
                      borderRadius: '50px',
                      px: 3
                    }}
                  >
                    Contact Us
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    height: '100%',
                    transition: 'transform 0.3s ease, background-color 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)'
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Help Center
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
                    Browse our comprehensive knowledge base
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/help-center"
                    variant="contained"
                    sx={{
                      backgroundColor: 'white',
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)'
                      },
                      borderRadius: '50px',
                      px: 3
                    }}
                  >
                    Visit Help Center
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    height: '100%',
                    transition: 'transform 0.3s ease, background-color 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)'
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Community Forum
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
                    Connect with other users and share experiences
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/community"
                    variant="contained"
                    sx={{
                      backgroundColor: 'white',
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)'
                      },
                      borderRadius: '50px',
                      px: 3
                    }}
                  >
                    Join Community
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </AnimatedElement>
      </Container>
    </Box>
  );
};

export default FAQ;