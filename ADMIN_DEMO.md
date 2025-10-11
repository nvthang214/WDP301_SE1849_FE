# Demo Admin Panel

## Hướng dẫn test Admin Panel

### 1. Khởi động Backend
```bash
cd WDP301_SE1849_BE
npm start
```

### 2. Khởi động Frontend
```bash
cd WDP301_SE1849_FE
npm run dev
```

### 3. Truy cập ứng dụng
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

### 4. Test đăng nhập
- Truy cập: http://localhost:5173/login
- Sử dụng tài khoản admin: `admin@example.com` / `admin123`
- Sau khi đăng nhập sẽ tự động chuyển đến admin panel

### 5. Test các tính năng admin

#### Dashboard
- URL: http://localhost:5173/admin
- Xem thống kê tổng quan hệ thống
- Số lượng users, roles, active/banned users

#### Quản lý người dùng
- URL: http://localhost:5173/admin/users
- Xem danh sách tất cả người dùng
- Tìm kiếm người dùng
- Khóa/mở khóa tài khoản
- Thay đổi vai trò người dùng

#### Quản lý vai trò
- URL: http://localhost:5173/admin/roles
- Xem danh sách vai trò
- Thống kê số lượng người dùng theo vai trò

### 6. Test bảo mật
- Thử truy cập `/admin` mà không đăng nhập → sẽ chuyển về `/login`
- Đăng nhập với user thường → sẽ chuyển về `/` (không có quyền admin)
- Token hết hạn → tự động đăng xuất

### 7. Test API Integration
- Kiểm tra Network tab trong DevTools
- Xem các request gửi đến backend
- Kiểm tra response từ API

## Cấu trúc dữ liệu mẫu

### Users trong database
```javascript
{
  _id: ObjectId(),
  Email: "admin@example.com",
  Password: "admin123",
  Role: "admin",
  FullName: "Admin User",
  phone_number: "0123456789",
  IsActive: true,
  role_id: ObjectId("role_admin_id")
}
```

### Roles trong database
```javascript
[
  { _id: ObjectId(), name: "admin" },
  { _id: ObjectId(), name: "user" },
  { _id: ObjectId(), name: "recruiter" },
  { _id: ObjectId(), name: "guest" }
]
```

## Troubleshooting

### Lỗi thường gặp

1. **CORS Error**
   - Cấu hình CORS trong backend
   - Kiểm tra VITE_BASE_URL

2. **401 Unauthorized**
   - Kiểm tra JWT token
   - Kiểm tra user role

3. **404 Not Found**
   - Kiểm tra API endpoints
   - Kiểm tra backend có chạy không

4. **Network Error**
   - Kiểm tra kết nối mạng
   - Kiểm tra firewall

### Debug Tips

1. Mở DevTools → Network tab để xem API calls
2. Mở DevTools → Application → Local Storage để xem token
3. Kiểm tra Console để xem lỗi JavaScript
4. Kiểm tra backend logs để xem lỗi server
