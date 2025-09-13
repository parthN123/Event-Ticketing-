import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Avatar,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import { motion } from 'framer-motion';
import AnimatedElement from '../components/animations/AnimatedElement';
import { Link as RouterLink } from 'react-router-dom';

// Icons
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GroupIcon from '@mui/icons-material/Group';
import PaymentIcon from '@mui/icons-material/Payment';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DevicesIcon from '@mui/icons-material/Devices';

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  // Team members data
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'Sarah has over 15 years of experience in event management and technology. She founded Eventify with a vision to make event planning and attendance seamless for everyone.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Michael leads our technology team with expertise in scalable architecture and user experience. He previously worked at major tech companies before joining Eventify.'
    },
    {
      name: 'Jessica Patel',
      role: 'Head of Operations',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      bio: 'Jessica ensures that all events run smoothly from planning to execution. Her attention to detail and organizational skills are unmatched.'
    },
    {
      name: 'David Wilson',
      role: 'Marketing Director',
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
      bio: 'David brings creative marketing strategies that have helped Eventify grow its user base by 200% in the last year alone.'
    }
  ];

  // Features data
  const features = [
    {
      icon: <EventAvailableIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: 'Easy Event Discovery',
      description: 'Find events that match your interests with our powerful search and recommendation engine.'
    },
    {
      icon: <GroupIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: 'Community Building',
      description: 'Connect with like-minded individuals and build your network through our events platform.'
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: 'Secure Payments',
      description: 'Book tickets with confidence using our secure payment processing system.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: 'Data Privacy',
      description: 'Your personal information is protected with enterprise-grade security measures.'
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: '24/7 Support',
      description: 'Our customer support team is available around the clock to assist with any issues.'
    },
    {
      icon: <DevicesIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: 'Multi-platform Access',
      description: 'Access our platform from any device - desktop, tablet, or mobile.'
    }
  ];

  // Milestones data
  const milestones = [
    {
      year: '2018',
      title: 'Company Founded',
      description: 'Eventify was established with the mission to revolutionize event management.'
    },
    {
      year: '2019',
      title: 'First 100K Users',
      description: 'Reached our first major user milestone and expanded to 5 major cities.'
    },
    {
      year: '2020',
      title: 'Virtual Events Launch',
      description: 'Adapted to the pandemic by introducing virtual event capabilities.'
    },
    {
      year: '2021',
      title: 'Series A Funding',
      description: 'Secured $10M in funding to accelerate growth and product development.'
    },
    {
      year: '2022',
      title: 'International Expansion',
      description: 'Expanded operations to Europe and Asia, now serving events in 15 countries.'
    },
    {
      year: '2023',
      title: 'Mobile App Launch',
      description: 'Released our award-winning mobile application for iOS and Android.'
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
      {/* Hero Section */}
      <Container maxWidth="lg">
        <AnimatedElement animation="fadeInUp">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
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
              About Eventify
            </Typography>
            <Typography 
              variant="h5" 
              color="textSecondary"
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto',
                mb: 4
              }}
            >
              Connecting people through memorable experiences since 2018
            </Typography>
            <Divider sx={{ width: '100px', mx: 'auto', mb: 4, borderColor: theme.palette.primary.main, borderWidth: 2 }} />
          </Box>
        </AnimatedElement>

        {/* Mission Section */}
        <Grid container spacing={6} alignItems="center" sx={{ mb: 10 }}>
          <Grid item xs={12} md={6}>
            <AnimatedElement animation="slideLeft" delay={0.2}>
              <Box>
                <Typography 
                  variant="h3" 
                  component="h2"
                  sx={{ 
                    fontWeight: 700, 
                    mb: 3,
                    color: theme.palette.text.primary
                  }}
                >
                  Our Mission
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 3,
                    fontSize: '1.1rem',
                    color: theme.palette.text.secondary,
                    lineHeight: 1.7
                  }}
                >
                  At Eventify, we believe that great events have the power to inspire, connect, and transform. Our mission is to make event discovery and attendance seamless, allowing people to focus on what matters most – creating meaningful connections and unforgettable experiences.
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 4,
                    fontSize: '1.1rem',
                    color: theme.palette.text.secondary,
                    lineHeight: 1.7
                  }}
                >
                  We're dedicated to empowering event organizers with powerful tools while providing attendees with a platform to discover events that match their interests and passions. Through technology and innovation, we're building a global community united by shared experiences.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/contact-us"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    borderRadius: '50px',
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Get In Touch
                </Button>
              </Box>
            </AnimatedElement>
          </Grid>
          <Grid item xs={12} md={6}>
            <AnimatedElement animation="slideRight" delay={0.3}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
                alt="People enjoying an event"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15)'
                }}
              />
            </AnimatedElement>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ mb: 10 }}>
          <AnimatedElement animation="fadeInUp">
            <Typography 
              variant="h3" 
              component="h2"
              sx={{ 
                textAlign: 'center', 
                fontWeight: 700, 
                mb: 6,
                color: theme.palette.text.primary
              }}
            >
              Why Choose Eventify
            </Typography>
          </AnimatedElement>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <AnimatedElement animation="fadeInUp" delay={0.1 * index}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      borderRadius: 2,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography 
                      variant="h5" 
                      component="h3"
                      sx={{ 
                        mb: 2, 
                        fontWeight: 600,
                        color: theme.palette.text.primary
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </AnimatedElement>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team Section */}
        <Box sx={{ mb: 10 }}>
          <AnimatedElement animation="fadeInUp">
            <Typography 
              variant="h3" 
              component="h2"
              sx={{ 
                textAlign: 'center', 
                fontWeight: 700, 
                mb: 2,
                color: theme.palette.text.primary
              }}
            >
              Meet Our Team
            </Typography>
            <Typography 
              variant="h6" 
              color="textSecondary"
              sx={{ 
                textAlign: 'center',
                maxWidth: '700px', 
                mx: 'auto',
                mb: 6
              }}
            >
              The passionate individuals behind Eventify who are dedicated to creating the best event platform for you
            </Typography>
          </AnimatedElement>

          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <AnimatedElement animation="fadeInUp" delay={0.1 * index}>
                  <Card
                    elevation={3}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="240"
                      image={member.image}
                      alt={member.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography 
                        variant="h5" 
                        component="h3"
                        sx={{ 
                          fontWeight: 600,
                          mb: 0.5,
                          color: theme.palette.text.primary
                        }}
                      >
                        {member.name}
                      </Typography>
                      <Typography 
                        variant="subtitle1" 
                        color="primary"
                        sx={{ 
                          mb: 2,
                          fontWeight: 500
                        }}
                      >
                        {member.role}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {member.bio}
                      </Typography>
                    </CardContent>
                  </Card>
                </AnimatedElement>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Milestones Section */}
        <Box sx={{ mb: 10 }}>
          <AnimatedElement animation="fadeInUp">
            <Typography 
              variant="h3" 
              component="h2"
              sx={{ 
                textAlign: 'center', 
                fontWeight: 700, 
                mb: 6,
                color: theme.palette.text.primary
              }}
            >
              Our Journey
            </Typography>
          </AnimatedElement>

          <Box
            sx={{
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: { xs: '20px', md: '50%' },
                width: '4px',
                backgroundColor: theme.palette.primary.main,
                transform: { md: 'translateX(-50%)' }
              }
            }}
          >
            {milestones.map((milestone, index) => (
              <AnimatedElement 
                key={index} 
                animation={index % 2 === 0 ? 'slideLeft' : 'slideRight'}
                delay={0.1 * index}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'row', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                    mb: 5,
                    position: 'relative'
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: '60px', md: '50%' },
                      display: 'flex',
                      justifyContent: { xs: 'flex-start', md: index % 2 === 0 ? 'flex-end' : 'flex-start' },
                      pr: { md: index % 2 === 0 ? 4 : 0 },
                      pl: { md: index % 2 === 0 ? 0 : 4 },
                      position: 'relative'
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        position: { xs: 'absolute', md: 'relative' },
                        left: { xs: 0, md: 'auto' },
                        zIndex: 1
                      }}
                    >
                      {milestone.year}
                    </Box>
                  </Box>

                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      width: { xs: 'calc(100% - 60px)', md: '50%' },
                      ml: { xs: 4, md: 0 }
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      component="h3"
                      sx={{ 
                        mb: 1, 
                        fontWeight: 600,
                        color: theme.palette.text.primary
                      }}
                    >
                      {milestone.title}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {milestone.description}
                    </Typography>
                  </Paper>
                </Box>
              </AnimatedElement>
            ))}
          </Box>
        </Box>

        {/* Call to Action */}
        <AnimatedElement animation="fadeInUp">
          <Paper
            elevation={6}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 2,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                backgroundImage: 'url("https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0
              }}
            />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h3" 
                component="h2"
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  color: 'white'
                }}
              >
                Ready to Experience Amazing Events?
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
                Join thousands of users who discover and attend events that match their interests every day.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={RouterLink}
                  to="/events"
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{
                    borderRadius: '50px',
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    backgroundColor: 'white',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Explore Events
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderRadius: '50px',
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Sign Up Now
                </Button>
              </Box>
            </Box>
          </Paper>
        </AnimatedElement>
      </Container>
    </Box>
  );
};

export default About;