import React, { ReactNode, useEffect, useState } from "react";
import CosmicLoader from "./cosmic-loader";
import { triggerLoading } from "@/lib/queryClient";

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
    
    // Notify loading state for global indicators
    triggerLoading(true);
    
    // Store the children to be rendered
    setContent(children);
    
    // Use requestAnimationFrame for better performance than setTimeout
    // This creates a smoother experience instead of flash loading
    let frameId: number;
    
    const startTransition = () => {
      // Faster loading time for better UX (200ms instead of 300ms)
      frameId = window.requestAnimationFrame(() => {
        setIsLoading(false);
        triggerLoading(false);
      });
    };
    
    // Small timeout to allow for the loading animation to be visible
    // but not too long to not slow down the experience
    const timer = setTimeout(startTransition, 200);
    
    return () => {
      clearTimeout(timer);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [children, location]);
  
  // Show cosmic loader during loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <CosmicLoader size="large" text="Navigating the cosmos..." />
      </div>
    );
  }
  
  // Render content with transition animation
  return (
    <div className="page-transition" style={{ animationDuration: '250ms' }}>
      {content}
    </div>
  );
}