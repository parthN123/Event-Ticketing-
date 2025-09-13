import React, { useState, useEffect } from 'react';
import { CardMedia, Box, CircularProgress, Typography } from '@mui/material';
import { getEventImageUrl, getRandomGitHubImage } from '../../utils/imageUtils';

const EventImage = ({ 
  event, 
  height = 200, 
  alt, 
  sx = {}, 
  showFallback = true,
  ...props 
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      setLoading(true);
      setError(false);

      try {
        // Get the primary image URL
        const primaryUrl = getEventImageUrl(event);
        setImageUrl(primaryUrl);

        // Test if the image loads
        const img = new Image();
        img.onload = () => {
          setLoading(false);
          setError(false);
        };
        img.onerror = () => {
          if (showFallback) {
            // Use GitHub fallback
            const fallbackUrl = getRandomGitHubImage(event?.category, event?._id);
            setImageUrl(fallbackUrl);
            setError(false);
          } else {
            setError(true);
          }
          setLoading(false);
        };
        img.src = primaryUrl;
      } catch (err) {
        console.error('Error loading event image:', err);
        if (showFallback) {
          const fallbackUrl = getRandomGitHubImage(event?.category, event?._id);
          setImageUrl(fallbackUrl);
        } else {
          setError(true);
        }
        setLoading(false);
      }
    };

    if (event) {
      loadImage();
    }
  }, [event, showFallback]);

  if (loading) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'grey.100',
          ...sx
        }}
        {...props}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error && !showFallback) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'grey.100',
          color: 'text.secondary',
          ...sx
        }}
        {...props}
      >
        <Typography variant="body2">Image not available</Typography>
      </Box>
    );
  }

  return (
    <CardMedia
      component="img"
      height={height}
      image={imageUrl}
      alt={alt || event?.name || 'Event image'}
      sx={{
        objectFit: 'cover',
        ...sx
      }}
      {...props}
    />
  );
};

export default EventImage;
