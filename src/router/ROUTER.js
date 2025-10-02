const USER = "/nguoi-dung";
const ROUTER = {
  HOME: "/",
  USER_LIST: `${USER}/danh-sach`,
  USER_LOCKED: `${USER}/tai-khoan-bi-khoa`,
  USER_VERIFICATION: `${USER}/xac-minh-tai-khoan`,
  USER_HIGHLIGHTED: `${USER}/nguoi-dung-noi-bat`,

  CONTENT_REPORTS: "/danh-sach-bao-cao-vi-pham",
  CONTENT_BANNED_KEYWORDS: "/tu-khoa-cam",

  CHAT_HISTORY: "/lich-su-chat-giua-nguoi-dung",

  SERVICE_PACKAGE_LIST: "/danh-sach-goi-dich-vu",
  SERVICE_INVOICES: "/giao-dich-hoa-don",
  PROMOTION_CODES: "/ma-khuyen-mai",
  PAYMENT_SETTINGS: "/cai-dat-thanh-toan",

  THEME_LOGO_SETTINGS: "/cau-hinh-theme-logo",

  SUPPORT_REQUESTS: "/danh-sach-yeu-cau-ho-tro",

  STAFF_LIST: "/danh-sach-nhan-vien",
  ACCESS_CONTROL: "/phan-quyen-truy-cap",
  OPERATION_LOG: "/nhat-ky-thao-tac",
};

export default ROUTER;
