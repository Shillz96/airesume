import React from 'react';
import { UnifiedContainer } from './unified/Container';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  paddingTop?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * PageContainer component
 * 
 * Provides consistent padding and maximum width for page content
 * Utilizes the UnifiedContainer for consistent spacing across all pages
 * Now with configurable top padding to optimize header placement
 */
const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = '',
  paddingTop = 'sm' // Reduced padding compared to previous default
}) => {
  return (
    <UnifiedContainer className={className} paddingTop={paddingTop}>
      {children}
    </UnifiedContainer>
  );
};

export default PageContainer;