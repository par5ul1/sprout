import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./app.tsx";
import { ThemeProvider } from "./lib/theme-provider";

const container = document.getElementById("app");
if (!container) {
  throw new Error("No container found");
}
const root = createRoot(container);
root.render(
  <ThemeProvider defaultTheme="system" storageKey="sprout-ui-theme">
    <App />
  </ThemeProvider>
);
