import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

import Loading from "../components/common/Loading";

export default function AuthRoute() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (user) {
    const from = location.state?.from;

    return <Navigate to={from || "/"} replace />;
  }

  return <Outlet />;
}
