import { createBrowserRouter } from "react-router-dom";

import Login from "./Login";
import Main from "../layouts/Main";
import About from "./About";

import ComputersComponent from "../components/ComputersComponent";
import Layout from "../layouts/Layout";
import UsersComponent from "../components/UsersComponent";
import ProtectedRoute from "./ProtectedRoute";
import HideIfNotAdmin from "../components/auth/HideIfNotAdmin";

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
        element: (
          <ProtectedRoute>
            <ComputersComponent />
          </ProtectedRoute>
        ), // Wrap protected routes with this
      },
      {
        path: "admin",
        element: (
          <HideIfNotAdmin>
            <UsersComponent />
          </HideIfNotAdmin>
        ),
      },
      // Add other child routes as needed
    ],
  },
];

const router = createBrowserRouter(routes);
export default router;
