import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeTheme } from "./lib/theme-loader";

// Initialize theme before rendering the app
// This loads all theme values from theme.json and sets CSS variables
initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
