import { ThemeProvider } from '@mui/material';
import { createAppTheme } from './assets/theme';
import './App.css';
import Layout from './layouts/Layout'
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from "./stores/authSlice";
import { RouterProvider } from 'react-router';
import { router } from './router';

function App() {
  const theme = createAppTheme();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;