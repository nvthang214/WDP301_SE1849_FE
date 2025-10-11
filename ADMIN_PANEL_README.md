# Admin Panel - Frontend

## Tổng quan

Admin Panel là phần giao diện quản trị hệ thống được xây dựng với React và Ant Design, tích hợp với các API admin đã có sẵn trong backend.

## Cấu trúc thư mục

```
src/
├── components/
│   ├── Auth/
│   │   └── AdminAuthGuard/          # Bảo vệ routes admin
│   └── Layout/
│       └── AdminLayout/             # Layout chính cho admin
├── pages/
│   ├── private/
│   │   └── Admin/
│   │       ├── index.jsx            # Trang chính admin
│   │       ├── Dashboard/           # Dashboard với thống kê
│   │       ├── UserManagement/      # Quản lý người dùng
│   │       └── RoleManagement/      # Quản lý vai trò
│   └── public/
│       └── Login/                   # Trang đăng nhập
├── services/
│   └── AdminService/                # Services gọi API admin
└── router/                          # Cấu hình routing
```

## Tính năng chính

### 1. Dashboard Admin
- Hiển thị thống kê tổng quan hệ thống
- Số lượng người dùng, người dùng hoạt động, bị khóa
- Số lượng vai trò trong hệ thống

### 2. Quản lý người dùng
- Xem danh sách tất cả người dùng
- Tìm kiếm người dùng theo tên, email, vai trò
- Khóa/mở khóa tài khoản người dùng
- Thay đổi vai trò người dùng
- Phân trang và sắp xếp

### 3. Quản lý vai trò
- Xem danh sách tất cả vai trò
- Thống kê số lượng người dùng theo vai trò
- Mô tả chi tiết từng vai trò

### 4. Bảo mật
- Xác thực JWT token
- Kiểm tra quyền admin
- Bảo vệ routes admin
- Tự động đăng xuất khi token hết hạn

## Cách sử dụng

### 1. Đăng nhập
- Truy cập `/login`
- Sử dụng tài khoản admin để đăng nhập
- Demo accounts:
  - Admin: `admin@example.com` / `admin123`
  - User: `user@example.com` / `user123`

### 2. Truy cập Admin Panel
- Sau khi đăng nhập với tài khoản admin, tự động chuyển đến `/admin`
- Sử dụng sidebar để điều hướng giữa các trang

### 3. Quản lý người dùng
- Truy cập `/admin/users`
- Sử dụng thanh tìm kiếm để lọc người dùng
- Click "Đổi vai trò" để thay đổi vai trò
- Click "Khóa/Mở khóa" để quản lý trạng thái tài khoản

### 4. Xem thống kê vai trò
- Truy cập `/admin/roles`
- Xem số lượng người dùng theo từng vai trò
- Đọc mô tả chi tiết về từng vai trò

## API Integration

### AdminService
```javascript
import { AdminService } from '../services/AdminService';

// Lấy danh sách người dùng
const users = await AdminService.getAllUsers();

// Lấy thông tin user theo ID
const user = await AdminService.getUserById(userId);

// Khóa/mở khóa user
await AdminService.banUser(userId, isActive);

// Cập nhật vai trò user
await AdminService.updateUserRole(userId, roleId);

// Lấy danh sách vai trò
const roles = await AdminService.getAllRoles();
```

### Authentication
- JWT token được lưu trong localStorage
- Token được tự động gửi kèm trong header Authorization
- Tự động xử lý lỗi authentication

## Environment Variables

Cần cấu hình trong file `.env`:

```env
VITE_BASE_URL=http://localhost:3000/api
```

## Dependencies

- React 19.1.0
- Ant Design 5.24.8
- React Router DOM 7.5.1
- Axios 1.8.4
- TailwindCSS 4.1.14

## Lưu ý

1. **Backend API**: Cần đảm bảo backend đang chạy và có các API admin
2. **CORS**: Cần cấu hình CORS trong backend để cho phép frontend gọi API
3. **JWT Secret**: Cần đảm bảo JWT_SECRET trong backend khớp với frontend
4. **Database**: Cần có dữ liệu mẫu trong database (users, roles)

## Troubleshooting

### Lỗi 401 Unauthorized
- Kiểm tra token có tồn tại trong localStorage
- Kiểm tra token có hết hạn không
- Kiểm tra user có role admin không

### Lỗi 403 Forbidden
- Kiểm tra middleware adminAuth trong backend
- Kiểm tra user có đúng role admin không

### Lỗi CORS
- Cấu hình CORS trong backend để cho phép origin của frontend
- Kiểm tra baseURL trong axios config

### Lỗi Network
- Kiểm tra backend có đang chạy không
- Kiểm tra VITE_BASE_URL có đúng không
- Kiểm tra firewall/antivirus có chặn không
