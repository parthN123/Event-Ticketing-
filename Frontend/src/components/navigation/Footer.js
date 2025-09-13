import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <Box className="footer">
      <Container>
        <Box className="footer-content">
          <Box className="footer-section">
            <Typography variant="h6">Event Ticketing</Typography>
            <Typography variant="body2">
              Your one-stop platform for event tickets
            </Typography>
          </Box>
          <Box className="footer-section">
            <Typography variant="h6">Quick Links</Typography>
            <Link component={RouterLink} to="/events" color="inherit">
              Events
            </Link>
            <Link component={RouterLink} to="/about" color="inherit">
              About
            </Link>
            <Link component={RouterLink} to="/contact" color="inherit">
              Contact
            </Link>
          </Box>
          <Box className="footer-section">
            <Typography variant="h6">Legal</Typography>
            <Link component={RouterLink} to="/terms" color="inherit">
              Terms of Service
            </Link>
            <Link component={RouterLink} to="/privacy" color="inherit">
              Privacy Policy
            </Link>
          </Box>
        </Box>
        <Typography variant="body2" className="copyright">
          © {new Date().getFullYear()} Event Ticketing. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 