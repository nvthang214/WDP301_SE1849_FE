import { Link } from "react-router-dom";
import ROUTER from "../../../../router/ROUTER";
import { Alert, Avatar, Badge, Button, Dropdown, Space } from "antd";
import { Bell } from "lucide-react";
import NotificationPopover from "./NotificationPopover";
import useAuthStore from "../../../../store/useAuthStore";

const Account = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <div className="flex items-center gap-3">
      {user ? (
        <Space size="large" align="center">
          <NotificationPopover />
          <Link to={ROUTER.CANDIDATE_OVERVIEW}>
            <Avatar className="bg-primary-600" src={user?.avatar ? user.avatar : null}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </Link>
        </Space>
      ) : (
        <>
          <Link to={ROUTER.LOGIN}>
            <Button type="default">Sign In</Button>
          </Link>
          <Link to={ROUTER.REGISTER}>
            <Button type="primary">Sign Up</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Account;
