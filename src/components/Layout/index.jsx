import { Outlet } from "react-router-dom";
import FooterCommon from "./Footer";
import HeaderMain from "./Header";
import BreadcrumbNav from "../Breadcrumb";

const LayoutCommon = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-neutral-900">
      <HeaderMain className="mx-auto max-w-7xl" />
      <div className="container mx-auto flex max-w-7xl px-4">
        <BreadcrumbNav />
      </div>
      <main className="container mx-auto flex max-w-7xl items-center justify-between px-4">
        <Outlet />
      </main>
      <FooterCommon />
    </div>
  );
};
export default LayoutCommon;
