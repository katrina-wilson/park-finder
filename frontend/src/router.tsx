import { createBrowserRouter } from "react-router";
import Layout from "./layouts/Layout";
import BaseLayout from './layouts/BaseLayout';
import Home from "./views/Home";
import Landing from "./views/Landing";
import ParkDetailsView from "./views/ParkDetailsView";

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
      { 
        index: true, 
        element: <Home /> 
      },
      {
        path: "parks/:parkId",
        element: <ParkDetailsView />
      }
    ],
  }
]);