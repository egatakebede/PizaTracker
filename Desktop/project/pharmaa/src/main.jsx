// main.jsx - Add better error handling
import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Prescriptions from "./pages/Prescriptions";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import { ThemeProvider } from "./components/ThemeContext";
import { PrescriptionsProvider } from "./pages/PrescriptionsContext";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

function AuthWrapper({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        setUser(user);
        setLoading(false);
        setAuthError(null);
      },
      (error) => {
        console.error("Auth state error:", error);
        setAuthError(error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold">Authentication Error</h2>
          <p>Please check your Firebase configuration</p>
          <p className="text-sm mt-2">{authError.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return children(user);
}

function PrivateRoute({ user, children }) {
  return user ? children : <Navigate to="/signin" replace />;
}

function PublicRoute({ user, children }) {
  return user ? <Navigate to="/" replace /> : children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthWrapper>
        {(user) => (
          <PrivateRoute user={user}>
            <Layout />
          </PrivateRoute>
        )}
      </AuthWrapper>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "inventory", element: <Inventory /> },
      { path: "sales", element: <Sales /> },
      { path: "prescriptions", element: <Prescriptions /> },
      { path: "customers", element: <Customers /> },
      { path: "suppliers", element: <Suppliers /> },
      { path: "reports", element: <Reports /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  {
    path: "/signin",
    element: (
      <AuthWrapper>
        {(user) => (
          <PublicRoute user={user}>
            <SignIn />
          </PublicRoute>
        )}
      </AuthWrapper>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthWrapper>
        {(user) => (
          <PublicRoute user={user}>
            <SignUp />
          </PublicRoute>
        )}
      </AuthWrapper>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <PrescriptionsProvider>
        <RouterProvider router={router} />
      </PrescriptionsProvider>
    </ThemeProvider>
  </StrictMode>
);