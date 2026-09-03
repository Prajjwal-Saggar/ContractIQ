import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ProtectedRoute = () => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/v0/auth/me`, {
      credentials: "include",
    })
      .then((res) => setAuthenticated(res.ok))
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <div>Checking authentication...</div>;

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;