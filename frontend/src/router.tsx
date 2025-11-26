import { createBrowserRouter } from "react-router";
import Layout from "./layouts/Layout";
import Home from "./views/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
]);