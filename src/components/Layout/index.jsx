import { Layout } from "antd";
import React from "react";
import MenuLeft from "../MenuLeft";
import HeaderMain from "./Header";
import "./style.scss";
const { Content, Sider } = Layout;

const LayoutCommon = ({ children }) => {
  const [headerHeight, setHeaderHeight] = React.useState(0);

  return (
    <Layout>
      <HeaderMain set={setHeaderHeight} />
      <Layout>
        <MenuLeft headerHeight={headerHeight} />
        <Layout>
          <Content
            style={{
              minHeight: 280,
              background: "var(--white)",
              padding: "10px 10px 0",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default LayoutCommon;
