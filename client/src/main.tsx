import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // This now includes all styles (base, components, layout, animations)
import { initializeTheme } from "./lib/theme-loader";

// Check for saved theme preference in localStorage and apply it immediately
// This prevents flash of wrong theme on page load
const applyThemeFromLocalStorage = () => {
  const savedTheme = localStorage.getItem('theme-mode');
  const html = document.documentElement;
  
  if (savedTheme === 'dark') {
    html.classList.add('dark');
    html.classList.remove('light');
  } else if (savedTheme === 'light') {
    html.classList.remove('dark');
    html.classList.add('light');
  } else {
    // Use system preference as fallback
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.classList.toggle('dark', prefersDark);
    html.classList.toggle('light', !prefersDark);
  }
};

// Apply saved theme immediately
applyThemeFromLocalStorage();

// Initialize theme after applying saved preference
// This loads all theme values from theme.json and sets CSS variables
initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
