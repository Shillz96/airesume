import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // This now includes all styles (base, components, layout, animations)
import { applyInitialTheme } from "./contexts/UnifiedThemeContext";

// Initialize theme before rendering to prevent flash of wrong theme
// This loads theme preferences from localStorage or system preferences
applyInitialTheme();

// Render the app
createRoot(document.getElementById("root")!).render(<App />);
