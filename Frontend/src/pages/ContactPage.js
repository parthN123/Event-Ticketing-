import React from 'react';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import './ContactPage.css';

const ContactPage = () => {
  return (
    <Box className="contact-page">
      <Container>
        <Typography variant="h3" gutterBottom className="title">
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          Have a question or want to get in touch? Fill out the form below or reach out to us via email or phone.
        </Typography>
        <Box component="form" noValidate autoComplete="off" className="contact-form">
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
          />
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <Button variant="contained" color="primary" className="submit-button">
            Send Message
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactPage; 