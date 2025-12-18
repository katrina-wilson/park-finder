// src/assets/theme.ts
import { createTheme } from "@mui/material";

function getCSSVariable(name: string, fallback = "#000000") {
  if (typeof window === "undefined" || !window.document) return fallback;
  const val = getComputedStyle(document.documentElement).getPropertyValue(name);
  return val ? val.trim() : fallback;
}

export function createAppTheme() {
  const primaryLight = getCSSVariable("--color-primary-light", "#E2D2E1");
  const primaryMain = getCSSVariable("--color-primary", "#422040");
  const primaryDark = getCSSVariable("--color-primary-dark", "#2A1B2A");

  const secondaryLight = getCSSVariable("--color-secondary-light", "#D2E2E1");
  const secondaryMain = getCSSVariable("--color-secondary", "#D27E00");
  const secondaryDark = getCSSVariable("--color-secondary-dark", "#1B2A2A");

  return createTheme({
    palette: {
      primary: {
        light: primaryLight,
        main: primaryMain,
        dark: primaryDark,
      },
      secondary: {
        light: secondaryLight,
        main: secondaryMain,
        dark: secondaryDark,
      },
    },
  });
}

// Default export for consumers that expect a default theme value.
// This creates a theme at module load time; consumers that need up-to-date
// variables should call `createAppTheme()` explicitly after CSS is loaded.
export default createAppTheme();