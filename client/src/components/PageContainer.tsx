import React from 'react';
import { Container } from './unified';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  paddingTop?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * PageContainer component
 * 
 * Provides consistent padding and maximum width for page content
 * Utilizes the unified Container for consistent spacing across all pages
 * Now with configurable top padding to optimize header placement
 */
const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = '',
  paddingTop = 'sm' // Reduced padding compared to previous default
}) => {
  return (
    <Container 
      className={className} 
      paddingY={paddingTop}
      maxWidth="lg"
    >
      {children}
    </Container>
  );
};

export default PageContainer;