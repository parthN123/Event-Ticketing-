import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './index.css';
import './styles/animations.css';
import App from './App';
import theme from './theme';

// Initialize AOS animation library
AOS.init({
  duration: 800,
  once: true,
  easing: 'ease-in-out',
});

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
