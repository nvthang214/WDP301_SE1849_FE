import { Outlet } from "react-router-dom";
import FooterCommon from "./Footer";
import HeaderMain from "./Header";
import BreadcrumbNav from "../Breadcrumb";

const LayoutCommon = () => {
  return (
    <div className="min-h-screen text-neutral-900">
      <HeaderMain className="mx-auto max-w-7xl" />
      <div className="mx-auto  max-w-7xl flex container px-4">
        <BreadcrumbNav />
      </div>
      <main className="mx-auto max-w-7xl flex container items-center justify-between px-4">
        <Outlet />
      </main>
      <FooterCommon />
    </div>
  );
};
export default LayoutCommon;
