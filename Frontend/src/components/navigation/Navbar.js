import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  return (
    <AppBar position="static" className="navbar">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          component={RouterLink} 
          to="/" 
          className="logo"
          sx={{ 
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          Event Ticketing
        </Typography>
        
        {isMobile ? (
          <Box>
            <IconButton
              color="inherit"
              aria-label="open mobile menu"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleMobileMenuClose} component={RouterLink} to="/events">
                Events
              </MenuItem>
              {isAuthenticated ? (
                <>
                  <MenuItem onClick={handleMobileMenuClose} component={RouterLink} to="/dashboard">
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleMobileMenuClose} component={RouterLink} to="/profile">
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => { handleMobileMenuClose(); handleLogout(); }}>
                    Logout
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={handleMobileMenuClose} component={RouterLink} to="/login">
                    Login
                  </MenuItem>
                  <MenuItem onClick={handleMobileMenuClose} component={RouterLink} to="/register">
                    Register
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>
        ) : (
          <Box className="nav-links" sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" component={RouterLink} to="/events">
              Events
            </Button>
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={RouterLink} to="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" component={RouterLink} to="/profile">
                  Profile
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={RouterLink} to="/register">
                  Register
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 