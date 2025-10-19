import { Outlet } from "react-router-dom";
import AdminSideBar from "../../../pages/private/Admin/components/AdminSideBar";
import HeaderMain from "../Header";

const LayoutAdmin = () => {
  return (
    <div className="flex flex-col h-screen">
      <HeaderMain className="mx-auto max-w-7xl" />
      <div className="flex flex-1 mx-auto max-w-7xl container justify-between overflow-hidden">
        <aside className="w-fit border-r border-neutral-200">
          <AdminSideBar />
        </aside>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <footer className="text-center py-1 border-t border-neutral-200 text-sm text-neutral-500">
        © {new Date().getFullYear()} Jobpilot · Job Portal. All rights reserved.
      </footer>
    </div>
  );
};

export default LayoutAdmin;
