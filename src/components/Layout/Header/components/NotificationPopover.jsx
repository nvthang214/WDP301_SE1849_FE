import { Badge, Button, Empty, List, Popover, Typography } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useNotificationStore from "../../../../store/useNotificationStore";
import NotificationSkeleton from "../../../Skeleton/NotificationSkeleton";

dayjs.extend(relativeTime);

const connectionMeta = {
  connected: { status: "success", text: "Online" },
  connecting: { status: "processing", text: "Đang kết nối" },
  disconnected: { status: "error", text: "Ngoại tuyến" },
};

const NotificationPopover = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const notifications = useNotificationStore((state) => state.items);
  const unread = useNotificationStore((state) => state.unread);
  const loading = useNotificationStore((state) => state.loading);
  const initialized = useNotificationStore((state) => state.initialized);
  const connection = useNotificationStore((state) => state.connection);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAsReadLocal = useNotificationStore((state) => state.markAsReadLocal);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const initializedRef = useRef(initialized);

  useEffect(() => {
    initializedRef.current = initialized;
  }, [initialized]);

  const { status, text } = connectionMeta[connection] || connectionMeta.disconnected;

  const handleOpenChange = async (nextOpen) => {
    setOpen(nextOpen);
    if (nextOpen && !initializedRef.current) {
      try {
        initializedRef.current = true;
        await fetchNotifications();
      } catch {
        initializedRef.current = false;
      }
    }
  };

  const handleMarkAll = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (unread === 0 || markingAll) return;
    try {
      setMarkingAll(true);
      await markAllAsRead();
    } finally {
      setMarkingAll(false);
    }
  };

  const handleItemClick = async (item) => {
    if (!item) return;
    if (!item.isRead) {
      markAsReadLocal(item.id);
      try {
        await markAsRead(item.id);
      } catch (error) {
        console.error("Failed to mark notification as read", error);
      }
    }
    if (item.action?.url) {
      navigate(item.action.url);
      setOpen(false);
    }
  };

  const renderContent = () => {
    if (loading && notifications.length === 0) {
      return <NotificationSkeleton />;
    }

    if (!loading && notifications.length === 0) {
      return (
        <Empty
          description="Không có thông báo"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="py-8"
        />
      );
    }

    return (
      <>
        {loading && <NotificationSkeleton />}
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              className={`cursor-pointer rounded-md px-2 py-1.5 transition ${
                item.isRead ? "" : "bg-neutral-50"
              }`}
              onClick={() => handleItemClick(item)}
            >
              <div className="flex w-full items-start gap-2">
                <span
                  className={`mt-1 h-2 w-2 rounded-full ${item.isRead ? "bg-gray-300" : "bg-blue-500"}`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <Typography.Text strong className="text-sm">
                      {item.title || "Thông báo hệ thống"}
                    </Typography.Text>
                    <Typography.Text type="secondary" className="text-[11px]">
                      {dayjs(item.createdAt).fromNow()}
                    </Typography.Text>
                  </div>
                  <Typography.Paragraph
                    className="mt-1 mb-0 text-xs text-gray-600"
                    ellipsis={{ rows: 2 }}
                  >
                    {item.message}
                  </Typography.Paragraph>
                  {item.action?.label && (
                    <Typography.Link className="text-xs" onClick={(e) => e.preventDefault()}>
                      {item.action.label}
                    </Typography.Link>
                  )}
                </div>
              </div>
            </List.Item>
          )}
        />
      </>
    );
  };

  const content = (
    <div className="max-h-96 w-80 overflow-y-auto">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Typography.Text strong>Thông báo</Typography.Text>
        <div className="flex items-center gap-2">
          <Badge status={status} text={text} />
          <Button
            type="link"
            size="small"
            onClick={handleMarkAll}
            disabled={unread === 0}
            loading={markingAll}
          >
            Đánh dấu đã đọc
          </Button>
        </div>
      </div>
      {renderContent()}
    </div>
  );

  return (
    <Popover
      content={content}
      placement="bottomRight"
      trigger="click"
      arrow
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Badge
        count={unread}
        overflowCount={99}
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
