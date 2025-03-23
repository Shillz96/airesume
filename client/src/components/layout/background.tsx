import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Modern background component that provides a clean, subtle gradient background
 * replacing the cosmic-themed background with a more professional modern design
 */
export default function Background() {
  const { isDarkMode } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      <div className={`absolute inset-0 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-background/90 via-background to-background/95' 
          : 'bg-gradient-to-br from-background/90 via-background to-background/95'
      }`}>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9IiM0NDQ0NTUiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9IjAuMiI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgLz48L2c+PC9zdmc+')] bg-center opacity-5"></div>
        
        {/* Glow elements */}
        <div className="absolute -top-40 -right-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-accent/20 blur-3xl"></div>
      </div>
    </div>
  );
}