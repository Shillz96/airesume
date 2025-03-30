import React from 'react';
import ReactDOM from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { MotionConfig } from 'framer-motion';
import App from './App';
import { UnifiedThemeProvider } from './contexts/UnifiedThemeContext';
import { AuthProvider } from './hooks/use-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Configure GSAP defaults
gsap.config({
  autoSleep: 60,
  force3D: true,
  nullTargetWarn: false,
});

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Framer Motion Config
const framerConfig = {
  transition: {
    duration: 0.6,
    ease: [0.6, -0.05, 0.01, 0.99],
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UnifiedThemeProvider>
        <AuthProvider>
          <MotionConfig {...framerConfig}>
            <App />
          </MotionConfig>
        </AuthProvider>
      </UnifiedThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
