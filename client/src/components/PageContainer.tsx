import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PageContainer component
 * 
 * Provides consistent padding and maximum width for page content
 * This helps maintain spacing consistency across all pages
 */
const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`container page-container ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;