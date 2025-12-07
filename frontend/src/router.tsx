import { createBrowserRouter } from "react-router";
import Layout from "./layouts/Layout";
import BaseLayout from './layouts/BaseLayout';
import Home from "./views/Home";
import Landing from "./views/Landing";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      { index: true, element: <Landing /> },
    ],
  },
  {
    path: "/home",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
    ],
  }
]);