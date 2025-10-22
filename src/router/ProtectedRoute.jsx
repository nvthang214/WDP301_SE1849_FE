import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import NotFound from "../components/NotFound";
import useAuthStore from "../store/useAuthStore";
import ROUTER from "./ROUTER";

const ProtectedRoute = ({ role }) => {
  const { accessToken, user } = useAuthStore();

  if (!accessToken) {
    return <Navigate to={ROUTER.LOGIN} replace />;
  }

  if (role && user?.role?.name !== role) {
    return <NotFound />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
