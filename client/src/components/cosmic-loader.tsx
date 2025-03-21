import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CosmicLoaderProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  text?: string;
  fullScreen?: boolean;
}

/**
 * A visually appealing cosmic-themed loading spinner
 */
export default function CosmicLoader({
  size = "medium",
  showText = true,
  text = "Loading...",
  fullScreen = false
}: CosmicLoaderProps) {
  // Set sizes based on the size prop
  const sizeClasses = {
    small: {
      container: "h-6 w-6",
      innerCircle: "h-6 w-6",
      outerCircle: "h-8 w-8",
      orbit1: "h-1.5 w-1.5",
      orbit2: "h-1 w-1",
      text: "text-xs"
    },
    medium: {
      container: "h-10 w-10",
      innerCircle: "h-10 w-10", 
      outerCircle: "h-14 w-14",
      orbit1: "h-2 w-2",
      orbit2: "h-1.5 w-1.5",
      text: "text-sm"
    },
    large: {
      container: "h-16 w-16",
      innerCircle: "h-16 w-16",
      outerCircle: "h-20 w-20",
      orbit1: "h-3 w-3",
      orbit2: "h-2 w-2",
      text: "text-base"
    }
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-4",
      fullScreen && "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
    )}>
      <div className="relative">
        {/* Main loader */}
        <Loader2 
          className={cn(
            sizeClasses[size].container,
            "animate-spin text-blue-500"
          )} 
        />
        
        {/* Glow effect */}
        <div 
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
            sizeClasses[size].outerCircle,
            "opacity-70 animate-pulse"
          )}
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0) 70%)",
            animation: "pulse 2s infinite ease-in-out"
          }}
        />
        
        {/* Orbital particles */}
        <div 
          className={cn(
            "absolute rounded-full bg-blue-400",
            sizeClasses[size].orbit1
          )}
          style={{
            top: "-2px",
            left: "50%",
            transform: "translateX(-50%)",
            boxShadow: "0 0 8px rgba(59,130,246,0.8)",
            animation: "orbit 3s infinite linear"
          }}
        />
        
        <div 
          className={cn(
            "absolute rounded-full bg-purple-400",
            sizeClasses[size].orbit2
          )}
          style={{
            bottom: "-2px",
            right: "50%",
            transform: "translateX(50%)",
            boxShadow: "0 0 8px rgba(147,51,234,0.8)",
            animation: "orbit 2.5s infinite linear reverse"
          }}
        />
      </div>
      
      {showText && (
        <p className={cn(
          "text-foreground/80 animate-pulse",
          sizeClasses[size].text
        )}>
          {text}
        </p>
      )}
      
      {/* Animations are defined in index.css */}
    </div>
  );
}