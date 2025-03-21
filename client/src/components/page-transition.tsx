import React, { ReactNode, useEffect, useState } from "react";
import CosmicLoader from "./cosmic-loader";

interface PageTransitionProps {
  children: ReactNode;
  location?: string;
}

/**
 * Adds smooth transition animations between pages and shows a loader during page changes
 */
export default function PageTransition({ children, location }: PageTransitionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<ReactNode>(null);
  
  useEffect(() => {
    // Start loading when location changes
    setIsLoading(true);
    
    // Store the children to be rendered
    setContent(children);
    
    // Simulate a page transition with a short delay
    // This creates a smoother experience instead of flash loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Shorter loading time for better UX
    
    return () => clearTimeout(timer);
  }, [children, location]);
  
  // Show cosmic loader during loading
  if (isLoading) {
    return <CosmicLoader />;
  }
  
  // Render content with transition animation
  return <div className="page-transition">{content}</div>;
}