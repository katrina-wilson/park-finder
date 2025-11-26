import { ThemeProvider } from '@mui/material';
import { createAppTheme } from './assets/theme';
import './App.css';
import Layout from './layouts/Layout'

function App() {
  const theme = createAppTheme();
  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  );
}

export default App;