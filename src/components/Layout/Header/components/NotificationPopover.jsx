import { Badge, Popover, Alert, List, Typography } from "antd";
import { Bell } from "lucide-react";
import NotificationSkeleton from "../../../Skeleton/NotificationSkeleton";
import { useState } from "react";

const notifications = [
  { id: 2, message: "Hệ thống sẽ bảo trì lúc 22h tối nay.", type: "warning" },
  { id: 3, message: "Ứng tuyển công việc thành công.", type: "success" },
  { id: 4, message: "Vui lòng tải CV.", type: "info" },
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
