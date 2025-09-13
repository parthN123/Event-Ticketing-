import React from 'react';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedElement from '../components/animations/AnimatedElement';

const NotFound = () => {
  const theme = useTheme();

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

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 200px)',
          textAlign: 'center',
          py: 8
        }}
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatedElement animation="scale" duration={0.7}>
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{
              fontSize: { xs: '6rem', md: '10rem' },
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            404
          </Typography>
        </AnimatedElement>

        <AnimatedElement animation="fadeIn" delay={0.2}>
          <Typography 
            variant="h4" 
            component="h2"
            sx={{ 
              mb: 3,
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            Page Not Found
          </Typography>
        </AnimatedElement>

        <AnimatedElement animation="fadeInUp" delay={0.4}>
          <Typography 
            variant="body1"
            sx={{ 
              mb: 4, 
              maxWidth: '600px',
              color: theme.palette.text.secondary
            }}
          >
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable. Please check the URL or return to the homepage.
          </Typography>
        </AnimatedElement>

        <AnimatedElement animation="bounce" delay={0.6}>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            size="large"
            sx={{
              borderRadius: '50px',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Back to Homepage
          </Button>
        </AnimatedElement>

        {/* Decorative elements */}
        <Box
          component={motion.div}
          sx={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: { xs: '80px', md: '120px' },
            height: { xs: '80px', md: '120px' },
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.primary.light}22, ${theme.palette.primary.light}00)`,
            zIndex: -1
          }}
          animate={{
            y: [0, 15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        <Box
          component={motion.div}
          sx={{
            position: 'absolute',
            bottom: '15%',
            left: '10%',
            width: { xs: '100px', md: '150px' },
            height: { xs: '100px', md: '150px' },
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.secondary.light}22, ${theme.palette.secondary.light}00)`,
            zIndex: -1
          }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />
      </Box>
    </Container>
  );
};

export default NotFound;