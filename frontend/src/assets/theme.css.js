import { colors } from "./colors.js";

export default `
  @theme inline {
    --color-primary-light: ${colors.primary.light};
    --color-primary: ${colors.primary.main};
    --color-primary-dark: ${colors.primary.dark};

    --color-secondary-light: ${colors.secondary.light};
    --color-secondary: ${colors.secondary.main};
    --color-secondary-dark: ${colors.secondary.dark};

    --color-background: ${colors.background};
    --color-border: ${colors.border};
  }
`;