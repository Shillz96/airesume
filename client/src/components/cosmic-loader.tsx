import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

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
  text = "Loading your cosmic journey...",
  fullScreen = false,
}: CosmicLoaderProps) {
  const [loadingDots, setLoadingDots] = useState("");
  
  // Animated loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 400);
    
    return () => clearInterval(interval);
  }, []);
  
  // Size mappings
  const sizeClasses = {
    small: "h-5 w-5",
    medium: "h-8 w-8",
    large: "h-12 w-12"
  };
  
  // Random, inspiring loading messages
  const loadingMessages = [
    "Loading your cosmic journey...",
    "Navigating through the stars...",
    "Preparing your career universe...",
    "Aligning with career opportunities...",
    "Reaching for the stars...",
    "Calculating career trajectory...",
  ];
  
  // Choose random message if no text is provided
  const [message] = useState(() => {
    if (text !== "Loading your cosmic journey...") return text;
    return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  });
  
  const containerClass = fullScreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen bg-black/80 backdrop-blur-sm"
    : "flex flex-col items-center justify-center py-8";
  
  return (
    <div className={containerClass}>
      {/* Orbital loader animation */}
      <div className="relative">
        <Loader2 
          className={`${sizeClasses[size]} animate-spin text-blue-500`} 
        />
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0) 70%)",
            animation: "pulse-slow 2s infinite ease-in-out"
          }}
        />
        
        {/* Small orbital particles */}
        <div 
          className="absolute h-2 w-2 rounded-full bg-blue-400"
          style={{
            top: "10%",
            left: "10%",
            boxShadow: "0 0 8px rgba(59,130,246,0.8)",
            animation: "orbit 3s infinite linear"
          }}
        />
        <div 
          className="absolute h-1.5 w-1.5 rounded-full bg-purple-400"
          style={{
            bottom: "15%",
            right: "10%",
            boxShadow: "0 0 8px rgba(192,132,252,0.8)",
            animation: "orbit 2.5s infinite linear reverse"
          }}
        />
      </div>
      
      {/* Loading text */}
      {showText && (
        <p className="mt-4 text-white/80 text-center max-w-xs">
          {message}
          <span className="inline-block w-6">{loadingDots}</span>
        </p>
      )}
    </div>
  );
}