import { Outlet, useLocation } from "react-router-dom";
import ROUTER from "../../router/ROUTER";
import FooterCommon from "./Footer";
import HeaderMain from "./Header";
import LayoutAuth from "./LayoutAuth";

const LayoutCommon = ({ children }) => {
  const location = useLocation();
  const content = children ?? <Outlet />;
  const pathname = location.pathname;

  const AUTH_CONFIG = {
    [ROUTER.LOGIN]: {
      heroTitle: "Over 175,324 candidates waiting for good employees.",
      heroSubtitle:
        "We help you connect with the right talent through a modern recruitment management system.",
      stats: [
        { label: "Live Jobs", value: "175324" },
        { label: "Companies", value: "97354" },
        { label: "New Jobs", value: "7532" },
      ],
    },
    [ROUTER.REGISTER]: {
      heroTitle: "Over 175,324 candidates waiting for good employees.",
      heroSubtitle:
        "We help you connect with the right talent through a modern recruitment management system.",
    },
    [ROUTER.FORGOT_PASSWORD]: {
      heroTitle: "Over 175,324 candidates waiting for good employees.",
      heroSubtitle:
        "We help you connect with the right talent through a modern recruitment management system.",
    },
    [ROUTER.RESET_PASSWORD]: {
      heroTitle: "Over 175,324 candidates waiting for good employees.",
      heroSubtitle:
        "We help you connect with the right talent through a modern recruitment management system.",
    },
  };

  if (AUTH_CONFIG[pathname]) {
    const { footer, ...layoutProps } = AUTH_CONFIG[pathname];
    return (
      <LayoutAuth {...layoutProps} formFooter={footer}>
        {content}
      </LayoutAuth>
    );
  }

  return (
    <div className="min-h-screen text-neutral-900">
      <HeaderMain />
      <main className="mx-auto flex max-w-7xl items-center justify-between px-4">{content}</main>
      <FooterCommon />
    </div>
  );
};
export default LayoutCommon;
