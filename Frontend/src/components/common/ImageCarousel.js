import React from 'react';
import Slider from 'react-slick';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

/**
 * ImageCarousel - A reusable carousel component for displaying images
 * 
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of items to display in the carousel
 * @param {Function} props.renderItem - Function to render each item
 * @param {number} props.slidesToShow - Number of slides to show at once
 * @param {number} props.slidesToScroll - Number of slides to scroll at once
 * @param {boolean} props.autoplay - Whether to autoplay the carousel
 * @param {number} props.autoplaySpeed - Autoplay speed in milliseconds
 * @param {boolean} props.dots - Whether to show dots navigation
 * @param {boolean} props.arrows - Whether to show arrow navigation
 * @param {boolean} props.infinite - Whether to loop the carousel
 * @param {Object} props.containerStyle - Additional styles for the container
 */
const ImageCarousel = ({
  items = [],
  renderItem,
  slidesToShow = 3,
  slidesToScroll = 1,
  autoplay = true,
  autoplaySpeed = 3000,
  dots = true,
  arrows = true,
  infinite = true,
  containerStyle = {},
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Responsive settings
  const responsive = [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: Math.min(slidesToShow, 2),
        slidesToScroll: 1,
        infinite: infinite,
        dots: dots
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        arrows: false
      }
    }
  ];

  // Adjust slides to show based on screen size
  const effectiveSlidesToShow = isMobile ? 1 : isTablet ? Math.min(slidesToShow, 2) : slidesToShow;

  const settings = {
    dots: dots,
    infinite: infinite,
    speed: 500,
    slidesToShow: effectiveSlidesToShow,
    slidesToScroll: slidesToScroll,
    autoplay: autoplay,
    autoplaySpeed: autoplaySpeed,
    arrows: arrows,
    responsive: responsive,
    ...props
  };

  return (
    <Box sx={{ 
      '.slick-slide': { 
        px: 1,
        '& > div': { height: '100%' } 
      },
      '.slick-dots': { 
        bottom: -30,
        '& li button:before': {
          fontSize: '10px',
          color: theme.palette.primary.main,
          opacity: 0.5
        },
        '& li.slick-active button:before': {
          opacity: 1,
          color: theme.palette.primary.main
        }
      },
      '.slick-prev, .slick-next': {
        zIndex: 1,
        '&:before': {
          fontSize: '24px',
          color: theme.palette.primary.main
        }
      },
      '.slick-prev': {
        left: -5,
        [theme.breakpoints.up('md')]: {
          left: -25
        }
      },
      '.slick-next': {
        right: -5,
        [theme.breakpoints.up('md')]: {
          right: -25
        }
      },
      ...containerStyle
    }}>
      <Slider {...settings}>
        {items.map((item, index) => (
          <div key={index}>
            {renderItem(item, index)}
          </div>
        ))}
      </Slider>
    </Box>
  );
};

export default ImageCarousel;