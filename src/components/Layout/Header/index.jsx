import { Alert, Button, Divider, Drawer, Input } from "antd";
import { Mail, Menu, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import ROUTE_META from "../../../router/ROUTER_META.js";
import ROUTER from "../../../router/ROUTER.js";
import { useState } from "react";
import Account from "./components/Account.jsx";
import Logo from "./components/Logo.jsx";
import useAuthStore from "../../../store/useAuthStore.js";

const navItems = [
  { label: ROUTE_META[ROUTER.HOME].breadcrumb, path: ROUTER.HOME },
  { label: ROUTE_META[ROUTER.JOB_LIST].breadcrumb, path: ROUTER.JOB_LIST },
];

const HeaderMain = ({ className }) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleSearch = (value) => {
    if (value && value.trim()) {
      navigate(`${ROUTER.JOB_LIST}?search=${encodeURIComponent(value.trim())}`);
    } else {
      navigate(ROUTER.JOB_LIST);
    }
  };
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="hidden border-b border-neutral-100 bg-neutral-100 text-xs text-neutral-500 lg:block">
        <div className={`flex items-center justify-between px-4 py-3 ${className}`}>
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.label} to={item.path} className="hover:text-primary-600 transition">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone className="text-primary-600 h-4 w-4" />
              +84-377-591-418
            </span>
            <span className="flex items-center gap-2">
              <Mail className="text-primary-600 h-4 w-4" />
              support@jobpilot.com
            </span>
          </div>
        </div>
      </div>

      <div className={`flex items-center justify-between gap-3 px-4 py-3 ${className}`}>
        <Logo />
        <form className="flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-2xl">
            <Input.Search
              placeholder="Search jobs, companies..."
              allowClear
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={handleSearch}
              size="large"
              className="w-full rounded-full"
            />
          </div>
        </form>
        <Account />

        {/* Mobile menu button */}
        <Button className="lg:!hidden" type="text" onClick={showDrawer}>
          <Menu />
        </Button>
        <Drawer
          title={<Logo />}
          placement="top"
          onClose={onClose}
          closable={false}
          open={open}
          height="fit-content"
        >
          <form className="flex-1 items-center justify-center">
            <div className="relative w-full">
              <Input.Search
                placeholder="Search jobs, companies..."
                allowClear
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onSearch={handleSearch}
                size="large"
                className="w-full rounded-full"
              />
            </div>
          </form>
          <Divider />
          <div className="flex items-center gap-3">
            <Link to={ROUTER.LOGIN}>
              <Button type="default">Sign In</Button>
            </Link>
            <Link to={ROUTER.REGISTER}>
              <Button type="primary">Sign Up</Button>
            </Link>
          </div>
        </Drawer>
      </div>
      {user?.isEmailVerified === false && (
        <Alert
          message="Warning: Your email is not verified. Please verify your email to access all features."
          banner
          type="warning"
          showIcon
          className="mx-auto w-full"
        />
      )}
    </header>
  );
};

export default HeaderMain;