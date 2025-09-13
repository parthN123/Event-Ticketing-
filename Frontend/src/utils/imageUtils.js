// Image utility functions for handling event images with fallbacks

// GitHub-hosted event images as fallbacks
const GITHUB_IMAGES = {
  'event1': 'https://github.com/parthN123/Event-Ticketing-/blob/master/Backend/uploads/events/1749537852441-event1.png?raw=true',
  'event2': 'https://github.com/parthN123/Event-Ticketing-/blob/master/Backend/uploads/events/1749539630950-event%202.png?raw=true',
  'event3': 'https://github.com/parthN123/Event-Ticketing-/blob/master/Backend/uploads/events/1749539807861-event3.webp?raw=true'
};

// Default fallback images by category
const CATEGORY_FALLBACKS = {
  'Music': GITHUB_IMAGES.event1,
  'Sports': GITHUB_IMAGES.event2,
  'Technology': GITHUB_IMAGES.event3,
  'Business': GITHUB_IMAGES.event1,
  'Education': GITHUB_IMAGES.event2,
  'Entertainment': GITHUB_IMAGES.event3,
  'Other': GITHUB_IMAGES.event1,
  'default': GITHUB_IMAGES.event1
};

/**
 * Get the best available image URL for an event
 * @param {Object} event - The event object
 * @param {string} event.image - The event's image URL
 * @param {string} event.category - The event's category
 * @param {string} event._id - The event's ID
 * @returns {string} The best available image URL
 */
export const getEventImageUrl = (event) => {
  if (!event) return CATEGORY_FALLBACKS.default;

  // If event has a valid image URL, use it
  if (event.image && event.image.trim() !== '') {
    // Check if it's a local image that might not be accessible
    if (event.image.startsWith('/uploads/') || event.image.includes('localhost')) {
      // For local images, try to construct the full URL or use fallback
      const baseUrl = process.env.REACT_APP_API_URL || 'https://event-ticketing-c8e8.onrender.com';
      const fullImageUrl = event.image.startsWith('http') ? event.image : `${baseUrl}${event.image}`;
      
      // Return the full URL, but we'll handle fallback in the component
      return fullImageUrl;
    }
    
    // If it's already a full URL, use it
    return event.image;
  }

  // Use category-based fallback
  const category = event.category?.toLowerCase();
  return CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.default;
};

/**
 * Get a random GitHub image for variety
 * @param {string} category - The event category
 * @param {string} eventId - The event ID for consistency
 * @returns {string} A GitHub image URL
 */
export const getRandomGitHubImage = (category, eventId) => {
  const images = Object.values(GITHUB_IMAGES);
  const index = eventId ? eventId.charCodeAt(0) % images.length : Math.floor(Math.random() * images.length);
  return images[index];
};

/**
 * Get all available GitHub images
 * @returns {Array} Array of GitHub image URLs
 */
export const getAllGitHubImages = () => {
  return Object.values(GITHUB_IMAGES);
};

/**
 * Check if an image URL is accessible
 * @param {string} url - The image URL to check
 * @returns {Promise<boolean>} True if image is accessible
 */
export const isImageAccessible = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Get image with fallback handling
 * @param {Object} event - The event object
 * @returns {Promise<string>} The best available image URL
 */
export const getImageWithFallback = async (event) => {
  if (!event) return CATEGORY_FALLBACKS.default;

  const primaryUrl = getEventImageUrl(event);
  
  // If it's a local/backend image, check if it's accessible
  if (primaryUrl.includes('event-ticketing-c8e8.onrender.com') || primaryUrl.includes('localhost')) {
    const isAccessible = await isImageAccessible(primaryUrl);
    if (isAccessible) {
      return primaryUrl;
    }
  } else if (primaryUrl.startsWith('http')) {
    // For other HTTP URLs, try them first
    const isAccessible = await isImageAccessible(primaryUrl);
    if (isAccessible) {
      return primaryUrl;
    }
  }

  // Fall back to GitHub images
  return getRandomGitHubImage(event.category, event._id);
};
