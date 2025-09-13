import React, { useState, useEffect } from 'react';
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
  Link as MuiLink,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedElement from '../components/animations/AnimatedElement';
import LockResetIcon from '@mui/icons-material/LockReset';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ResetPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get token from URL query params
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    token: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  
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

  // Verify token on component mount
  useEffect(() => {
    if (!token) {
      setVerifyingToken(false);
      setErrors({
        ...errors,
        token: 'Invalid or missing reset token. Please request a new password reset link.'
      });
      return;
    }
    
    // Simulate token verification
    setTimeout(() => {
      setVerifyingToken(false);
      setTokenValid(true);
      
      // In a real application, you would verify the token with your API
      // try {
      //   const response = await axios.get(`/api/auth/verify-reset-token?token=${token}`);
      //   setVerifyingToken(false);
      //   setTokenValid(true);
      // } catch (error) {
      //   setVerifyingToken(false);
      //   setTokenValid(false);
      //   setErrors({
      //     ...errors,
      //     token: error.response?.data?.message || 'Invalid or expired token. Please request a new password reset link.'
      //   });
      // }
    }, 1500);
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    // Clear confirm password error when password changes
    if (name === 'password' && formData.confirmPassword && errors.confirmPassword) {
      setErrors({ ...errors, confirmPassword: '' });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      isValid = false;
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
        message: 'Password has been successfully reset',
        severity: 'success'
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }, 1500);
    
    // In a real application, you would make an API call here
    // try {
    //   const response = await axios.post('/api/auth/reset-password', {
    //     token,
    //     password: formData.password
    //   });
    //   setLoading(false);
    //   setSnackbar({
    //     open: true,
    //     message: response.data.message || 'Password has been successfully reset',
    //     severity: 'success'
    //   });
    //   
    //   // Redirect to login after 2 seconds
    //   setTimeout(() => {
    //     navigate('/login');
    //   }, 2000);
    // } catch (error) {
    //   setLoading(false);
    //   setSnackbar({
    //     open: true,
    //     message: error.response?.data?.message || 'Failed to reset password. Please try again.',
    //     severity: 'error'
    //   });
    // }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (verifyingToken) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 200px)'
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Verifying reset token...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!tokenValid) {
    return (
      <Container maxWidth="sm">
        <Box
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
                textAlign: 'center'
              }}
            >
              <Typography
                variant="h5"
                component="h1"
                color="error"
                sx={{ mb: 3, fontWeight: 600 }}
              >
                Invalid Reset Link
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4 }}>
                {errors.token}
              </Typography>
              
              <Button
                component={RouterLink}
                to="/forgot-password"
                variant="contained"
                color="primary"
                sx={{ borderRadius: 28, px: 4, py: 1.2 }}
              >
                Request New Link
              </Button>
            </Paper>
          </AnimatedElement>
        </Box>
      </Container>
    );
  }

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
                <LockResetIcon
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
                Reset Password
              </Typography>
              
              <Typography
                variant="body1"
                color="textSecondary"
                align="center"
                sx={{ mb: 3 }}
              >
                Create a new password for your account
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                name="password"
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
                {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;