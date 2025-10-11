import { useRoutes, Navigate } from "react-router-dom";
import LayoutCommon from "../components/Layout";
import AdminLayout from "../components/Layout/AdminLayout";
import AdminAuthGuard from "../components/Auth/AdminAuthGuard";

import LazyLoadingComponent from "../components/LazyLoading";
import NotFound from "../pages/public/NotFound";
import ROUTER from "./ROUTER";
import React from "react";

// react lazy imports
// const HomeMain = React.lazy(() => import("../pages/private/Home"));

// Public lazy imports
const Login = React.lazy(() => import("../pages/public/Login"));

// Admin lazy imports
const AdminMain = React.lazy(() => import("../pages/private/Admin"));
const AdminDashboard = React.lazy(() => import("../pages/private/Admin/Dashboard"));
const UserManagement = React.lazy(() => import("../pages/private/Admin/UserManagement"));
const RoleManagement = React.lazy(() => import("../pages/private/Admin/RoleManagement"));

const routes = [
  {
    path: ROUTER.HOME,
    element: (
      <LazyLoadingComponent>
        <div>Home Page</div>
      </LazyLoadingComponent>
    ),
  },

  // Login route
  {
    path: ROUTER.LOGIN,
    element: (
      <LazyLoadingComponent>
        <Login />
      </LazyLoadingComponent>
    ),
  },

  // Admin routes - redirect to dashboard
  {
    path: ROUTER.ADMIN,
    element: <Navigate to={ROUTER.ADMIN_DASHBOARD} replace />,
  },
  {
    path: ROUTER.ADMIN_DASHBOARD,
    element: (
      <AdminAuthGuard>
        <AdminLayout>
          <LazyLoadingComponent>
            <AdminDashboard />
          </LazyLoadingComponent>
        </AdminLayout>
      </AdminAuthGuard>
    ),
  },
  {
    path: ROUTER.ADMIN_USERS,
    element: (
      <AdminAuthGuard>
        <AdminLayout>
          <LazyLoadingComponent>
            <UserManagement />
          </LazyLoadingComponent>
        </AdminLayout>
      </AdminAuthGuard>
    ),
  },
  {
    path: ROUTER.ADMIN_ROLES,
    element: (
      <AdminAuthGuard>
        <AdminLayout>
          <LazyLoadingComponent>
            <RoleManagement />
          </LazyLoadingComponent>
        </AdminLayout>
      </AdminAuthGuard>
    ),
  },

  {
    path: "*",
    element: (
      <LazyLoadingComponent>
        <NotFound />
      </LazyLoadingComponent>
    ),
  },
];

const AppRouter = () => {
  const renderRouter = useRoutes(routes);
  return <LayoutCommon>{renderRouter}</LayoutCommon>;
};

export default AppRouter;
