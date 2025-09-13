import React from 'react';
import './ParticleBackground.css';

/**
 * A component that renders an animated particle background effect
 * This is a simplified version using CSS and framer-motion
 * For more complex particle effects, consider using libraries like react-tsparticles
 */
const ParticleBackground = () => {
  return (
    <div className="particle-background">
      {Array.from({ length: 50 }).map((_, index) => (
        <div key={index} className="particle" />
      ))}
    </div>
  );
};

export default ParticleBackground;