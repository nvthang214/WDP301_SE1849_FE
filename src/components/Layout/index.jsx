import { Layout } from "antd";
import HeaderMain from "./Header";
const { Content, Sider } = Layout;

const LayoutCommon = ({ children }) => {
  return (
    <div>
      <HeaderMain />

      <div>{children}</div>
    </div>
  );
};
export default LayoutCommon;
