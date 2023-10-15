import { createBrowserRouter } from "react-router-dom";

import Login from "./Login";
import Main from "../layouts/Main";

import ComputersComponent from "../components/ComputersComponent";
import Layout from "../layouts/Layout";

const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout></Layout>,
  },
  {
    path: "admin",
    element: <Main></Main>,
  },
  {
    path: "computers",
    element: <ComputersComponent />,
  },
];

const router = createBrowserRouter(routes);
export default router;
