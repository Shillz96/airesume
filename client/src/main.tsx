import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Import our main CSS file which imports all other CSS files
import "./styles/main.css";
import { initializeTheme } from "./lib/theme-loader";

// Initialize theme before rendering the app
// This loads all theme values from theme.json and sets CSS variables
initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
