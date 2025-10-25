import { Avatar, Button, Space } from "antd";
import { Link } from "react-router-dom";
import ROUTER from "../../../../router/ROUTER";
import useAuthStore from "../../../../store/useAuthStore";
import NotificationPopover from "./NotificationPopover";

const Account = () => {
  const user = useAuthStore((state) => state.user);
  const PAGE = {
    admin: ROUTER.ADMIN_OVERVIEW,
    recruiter: ROUTER.RECRUITER_OVERVIEW,
    candidate: ROUTER.CANDIDATE_OVERVIEW,
  };
  return (
    <div className="flex items-center gap-3">
      {user ? (
        <Space size="large" align="center">
          <NotificationPopover />
          <Link to={PAGE[user?.role?.name]}>
            <Avatar className="bg-primary-600" src={user?.avatar?.url || null}>
              {user?.lastName?.charAt(0).toUpperCase()}
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
