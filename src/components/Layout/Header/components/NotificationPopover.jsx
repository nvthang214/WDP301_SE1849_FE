import { Badge, Popover, Alert, List, Typography } from "antd";
import { Bell } from "lucide-react";
import NotificationSkeleton from "../../../Skeleton/NotificationSkeleton";
import { useState } from "react";

const notifications = [
  { id: 1, message: "Bạn có đơn hàng mới.", type: "info" },
  { id: 2, message: "Hệ thống sẽ bảo trì lúc 22h tối nay.", type: "warning" },
  { id: 3, message: "Thanh toán của bạn đã được xác nhận.", type: "success" },
  { id: 4, message: "Có người vừa bình luận bài viết của bạn.", type: "info" },
  { id: 5, message: "Tài khoản của bạn đã được nâng cấp.", type: "success" },
  { id: 6, message: "Bạn có thông báo mới từ hệ thống.", type: "info" },
  { id: 7, message: "Đơn hàng #1234 đã được giao.", type: "success" },
  { id: 8, message: "Đăng nhập từ thiết bị mới.", type: "warning" },
  { id: 9, message: "Cập nhật chính sách bảo mật.", type: "info" },
  { id: 10, message: "Tin khuyến mãi dành riêng cho bạn.", type: "success" },
  { id: 11, message: "Bạn có 1 tin nhắn mới.", type: "info" },
  { id: 12, message: "Phiên đăng nhập của bạn sắp hết hạn.", type: "warning" },
];

const NotificationPopover = () => {
  const [loading, setLoading] = useState(false);
  const content = (
    <div className="max-h-96 w-80 overflow-y-auto">
      <Typography.Text strong className="mb-2 block">
        Thông báo ({notifications.length})
      </Typography.Text>
      {loading ? (
        <NotificationSkeleton />
      ) : (
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item>
              <Alert message={item.message} type={item.type} showIcon />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Popover content={content} placement="bottomRight" trigger="click" arrow>
      <Badge
        count={notifications.length || 0}
        showZero={false}
        size="small"
        className="cursor-pointer"
      >
        <Bell className="cursor-pointer text-gray-700" />
      </Badge>
    </Popover>
  );
};

export default NotificationPopover;
