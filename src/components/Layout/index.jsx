import { Layout } from "antd";
import HeaderMain from "./Header";
import FooterCommon from "./Footer";
const { Content, Sider } = Layout;

const LayoutCommon = ({ children }) => {
  return (
    <div className="">
      {/* Header */}
      <HeaderMain />

      {/* Content */}
      <div className="min-h-screen">{children}</div>

      {/* Footer */}
      <FooterCommon />
    </div>
  );
};
export default LayoutCommon;
