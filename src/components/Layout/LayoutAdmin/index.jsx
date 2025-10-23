import { Outlet } from "react-router-dom";
import AdminSideBar from "../../../pages/private/Admin/components/AdminSideBar";
import HeaderMain from "../Header";

const LayoutAdmin = () => {
  return (
    <div className="flex h-screen flex-col">
      <HeaderMain className="mx-auto max-w-7xl" />

      <div className="container mx-auto flex max-w-7xl flex-1 justify-between overflow-hidden">
        <aside className="w-fit border-r border-neutral-200">
          <AdminSideBar />
        </aside>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <footer className="border-t border-neutral-200 py-1 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} Jobpilot · Job Portal. All rights reserved.
      </footer>
    </div>
  );
};

export default LayoutAdmin;
