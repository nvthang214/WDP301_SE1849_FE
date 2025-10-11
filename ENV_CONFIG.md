# Cấu hình Environment Variables

Tạo file `.env` trong thư mục `WDP301_SE1849_FE` với nội dung:

```env
# Base URL của Backend API
VITE_BASE_URL=http://localhost:3000/api

# Các cấu hình khác (nếu cần)
# VITE_APP_NAME=Job Portal Admin
# VITE_APP_VERSION=1.0.0
```

## Lưu ý:
- File `.env` không được commit vào git
- Thay đổi VITE_BASE_URL nếu backend chạy trên port khác
- Restart dev server sau khi thay đổi .env
