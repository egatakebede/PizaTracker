import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Layout from "./src/components/Layout";
import Dashboard from "./src/pages/Dashboard";
import Inventory from "./src/pages/Inventory";
import Sales from "./src/pages/Sales";
import Prescriptions from "./src/pages/Prescriptions";
import Customers from "./src/pages/Customers";
import Suppliers from "./src/pages/Suppliers";
import Reports from "./src/pages/Reports";
import Settings from "./src/pages/Settings";
import NotFound from "./src/pages/NotFound";

import SignIn from "./src/pages/SignIn";
import SignUp from "./src/pages/SignUp";

import { ThemeProvider } from "./src/components/ThemeContext";
import { auth } from "./src/firebase"; // make sure you have firebase.js

// Optional: PrivateRoute to protect dashboard routes
function PrivateRoute({ children }) {
  return auth.currentUser ? children : <Navigate to="/signin" />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <PrivateRoute><Dashboard /></PrivateRoute> },
      { path: "inventory", element: <PrivateRoute><Inventory /></PrivateRoute> },
      { path: "sales", element: <PrivateRoute><Sales /></PrivateRoute> },
      { path: "prescriptions", element: <PrivateRoute><Prescriptions /></PrivateRoute> },
      { path: "customers", element: <PrivateRoute><Customers /></PrivateRoute> },
      { path: "suppliers", element: <PrivateRoute><Suppliers /></PrivateRoute> },
      { path: "reports", element: <PrivateRoute><Reports /></PrivateRoute> },
      { path: "settings", element: <PrivateRoute><Settings /></PrivateRoute> },
      { path: "*", element: <NotFound /> },
    ],
  },
  // Auth routes outside Layout
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
// In main.jsx - remove the logout route
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <PrivateRoute><Dashboard /></PrivateRoute> },
      { path: "inventory", element: <PrivateRoute><Inventory /></PrivateRoute> },
      { path: "sales", element: <PrivateRoute><Sales /></PrivateRoute> },
      { path: "prescriptions", element: <PrivateRoute><Prescriptions /></PrivateRoute> },
      { path: "customers", element: <PrivateRoute><Customers /></PrivateRoute> },
      { path: "suppliers", element: <PrivateRoute><Suppliers /></PrivateRoute> },
      { path: "reports", element: <PrivateRoute><Reports /></PrivateRoute> },
      { path: "settings", element: <PrivateRoute><Settings /></PrivateRoute> },
      { path: "*", element: <NotFound /> },
    ],
  },
  // Auth routes outside Layout
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },
  // Remove the logout route from here
]);