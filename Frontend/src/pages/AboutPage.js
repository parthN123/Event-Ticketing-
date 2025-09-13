import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <Box className="about-page">
      <Container>
        <Typography variant="h3" gutterBottom className="title">
          About Us
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to Event Ticketing, your number one source for finding and booking tickets to amazing events. We're dedicated to providing you the best ticketing experience, with a focus on ease of use, security, and a wide variety of events.
        </Typography>
        <Typography variant="body1" paragraph>
          Founded in [Year], Event Ticketing has come a long way from its beginnings. When we first started out, our passion for [e.g. helping people discover local events, creating seamless ticketing experiences] drove us to start our own business.
        </Typography>
        <Typography variant="body1">
          We hope you enjoy our service as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
        </Typography>
      </Container>
    </Box>
  );
};

export default AboutPage; 