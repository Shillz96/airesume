import React, { memo } from 'react';

/**
 * CosmicBackground component - Simplified version
 * 
 * This creates the starry cosmic background effect using CSS from our unified theme
 * It's optimized with memoization to prevent re-renders when state changes
 */
const CosmicBackground: React.FC = () => {
  return (
    <div className="cosmic-background" aria-hidden="true">
      {/* The star field and nebula effects are created using CSS pseudo-elements */}
    </div>
  );
};

// Using memo to prevent unnecessary re-renders
export default memo(CosmicBackground);