import React, { useContext } from "react";
import { Avatar, Layout } from "antd";
const { Header } = Layout;
import "./header.scss";
import img from "../../../assets/images/Logo/logo-removebg-preview.png";
import { useElementSize } from "../../../hook/useElementSize";
import { StoreContext } from "../../Providers/Context";

const HeaderMain = (props) => {
  const { store } = useContext(StoreContext);
  const { loginStore } = store;
  const { setIsLogin } = loginStore;
  const [ref, size] = useElementSize();
  const { set } = props;
  React.useEffect(() => {
    if (set) {
      set(size.height);
    }
  }, [size, set]);

  return (
    <Header
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        background: "var(--white)",
      }}
      className="layout__common--header"
    >
      <div className="layout__common--header__logo">
        <div className="layout__common--header__logo--img">
          <img src={img} alt="logo" />
        </div>
        <div className="layout__common--header__logo--name">Lover</div>
      </div>
      <div className="layout__common--header__user">
        <div className="layout__common--header__user--ava">
          <Avatar alt="ảnh" src={img} size={"default"} />
        </div>
        <div
          className="layout__common--header__user--group"
          onClick={() => setIsLogin(false)}
        >
          <div className="layout__common--header__user--group--name">
            Nguyễn Văn Thắng
          </div>
          <div className="layout__common--header__user--group--type">
            Quản trị viên
          </div>
        </div>
      </div>
    </Header>
  );
};

export default HeaderMain;
