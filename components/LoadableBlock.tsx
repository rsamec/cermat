'use client'
import React from 'react';

interface LoadableBlockProps {
  isLoaded: boolean;
  children: React.ReactNode;
}

const LoadableBlock: React.FC<LoadableBlockProps> = ({ isLoaded, children }) => {
  if (isLoaded) {
    return <>{children}</>; // Render the child components if the property is loaded
  } else {
    // Render a placeholder or handle the case where the property is not loaded
    return <p>Loading...</p>;
  }
};

export default LoadableBlock;
