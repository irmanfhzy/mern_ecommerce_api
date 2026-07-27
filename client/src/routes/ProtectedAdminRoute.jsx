import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ROLE } from "@ecommerce/shared/constants/index.js";
import Loading from "../components/common/Loading";

export default function AdminRoute() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== ROLE.ADMIN) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
