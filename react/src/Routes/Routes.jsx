import { createBrowserRouter } from "react-router-dom";

import Login from "./Login";
import Main from "../layouts/Main";
import About from "./About";

import ComputersComponent from "../components/ComputersComponent";
import Layout from "../layouts/Layout";
import UsersComponent from "../components/UsersComponent";

const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout></Layout>,
    children: [
      {
        path: "/",
        element: <About />,
      },
      {
        path: "computers",
        element: <ComputersComponent />,
      },
      {
        path: "admin",
        element: <UsersComponent />,
      },
      // Add other child routes as needed
    ],
  },
];

const router = createBrowserRouter(routes);
export default router;
