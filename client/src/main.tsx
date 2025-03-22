import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Import the new master cosmic theme
import "./styles/cosmic-theme.css";
// Import the global cosmic background
import "./styles/global-cosmic-bg.css";
import { initializeTheme } from "./lib/theme-loader";

// Initialize theme before rendering the app
// This loads all theme values from theme.json and sets CSS variables
initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
