import React from 'react';
import { CSSTransition } from 'react-transition-group';

/**
 * AnimatedElement - A reusable component for adding animations to any element
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {string} props.animation - Animation type: 'fadeIn', 'slideUp', 'slideIn', 'scale', 'bounce'
 * @param {number} props.delay - Delay before animation starts (in seconds)
 * @param {number} props.duration - Animation duration (in seconds)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {string} props.as - HTML element type to render
 */
function AnimatedElement({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.5,
  className = '',
  style = {},
  as = 'div',
  ...props
}) {
  // Define valid HTML elements
  const validElements = [
    'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'button', 'a', 'ul', 'ol', 'li', 'section', 'article',
    'header', 'footer', 'main', 'nav', 'form', 'input'
  ];
  
  // Ensure we use a valid element type
  const elementType = validElements.includes(as) ? as : 'div';
  
  // Create the component using the determined element type
  const Component = elementType;
  
  // Render the component with CSSTransition
  return (
    <CSSTransition
      in={true}
      appear={true}
      timeout={duration * 1000}
      classNames={animation}
    >
      <Component
        className={`animated-element ${className}`}
        style={{
          ...style,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`
        }}
      {...props}
    >
      {children}
      </Component>
    </CSSTransition>
  );
}

export default AnimatedElement;