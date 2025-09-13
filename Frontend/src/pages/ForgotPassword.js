import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
  useTheme,
  Link as MuiLink
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedElement from '../components/animations/AnimatedElement';
import EmailIcon from '@mui/icons-material/Email';

const ForgotPassword = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
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

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) validateEmail(e.target.value);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(email)) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Password reset instructions have been sent to your email',
        severity: 'success'
      });
      // Clear form
      setEmail('');
    }, 1500);
    
    // In a real application, you would make an API call here
    // try {
    //   const response = await axios.post('/api/auth/forgot-password', { email });
    //   setLoading(false);
    //   setSnackbar({
    //     open: true,
    //     message: response.data.message || 'Password reset instructions have been sent to your email',
    //     severity: 'success'
    //   });
    //   setEmail('');
    // } catch (error) {
    //   setLoading(false);
    //   setSnackbar({
    //     open: true,
    //     message: error.response?.data?.message || 'Failed to send reset instructions. Please try again.',
    //     severity: 'error'
    //   });
    // }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="sm">
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 200px)',
          py: 8
        }}
      >
        <AnimatedElement animation="fadeInUp">
          <Paper
            elevation={6}
            sx={{
              p: { xs: 3, sm: 5 },
              width: '100%',
              borderRadius: 2,
              background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  backgroundColor: 'primary.light',
                  mb: 2
                }}
              >
                <EmailIcon
                  sx={{
                    fontSize: 40,
                    color: 'primary.main'
                  }}
                />
              </Box>
              
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Forgot Password
              </Typography>
              
              <Typography
                variant="body1"
                color="textSecondary"
                align="center"
                sx={{ mb: 3 }}
              >
                Enter your email address and we'll send you instructions to reset your password.
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError}
                margin="normal"
                required
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  mb: 3,
                  borderRadius: '50px',
                  fontWeight: 600,
                  boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <MuiLink
                  component={RouterLink}
                  to="/login"
                  underline="hover"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    '&:hover': {
                      color: 'primary.dark'
                    }
                  }}
                >
                  Back to Login
                </MuiLink>
              </Box>
            </form>
          </Paper>
        </AnimatedElement>
      </Box>

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
    </Container>
  );
};

export default ForgotPassword;