import { Layout } from "antd";
const { Content, Sider } = Layout;

const LayoutCommon = ({ children }) => {
  return (
    <Layout>
      {/* <HeaderMain set={setHeaderHeight} /> */}
      <Layout>
        {/* <MenuLeft headerHeight={headerHeight} /> */}
        <Layout>
          <Content>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default LayoutCommon;
