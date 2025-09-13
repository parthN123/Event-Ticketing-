import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from '../navigation/Navbar';
import Footer from '../navigation/Footer';
import { Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  return (
    <Box className="layout" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box sx={{ flex: 1 }}>
        <Container 
          className="content" 
          maxWidth="lg" 
          sx={{ 
            py: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 }
          }}
        >
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;