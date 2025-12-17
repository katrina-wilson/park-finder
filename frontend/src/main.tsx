import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { router } from './router';
import { stores } from './stores/stores';
import "../index.css";
import { createAppTheme } from "./assets/theme";
import 'leaflet/dist/leaflet.css';
import "@fontsource/playfair-display-sc/400.css";
import "@fontsource/playfair-display-sc/400-italic.css";
import { ToastProvider } from "./contexts/ToastContext";
import App from "./App";

const theme = createAppTheme();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={stores}>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <App/>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);