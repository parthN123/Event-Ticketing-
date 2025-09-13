import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from '../navigation/Navbar';
import Footer from '../navigation/Footer';
import { Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  return (
    <Box className="layout">
      <Navbar />
      <Container className="content">
            <Outlet />
          </Container>
      <Footer />
    </Box>
  );
};

export default Layout;