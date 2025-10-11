# Hướng dẫn sử dụng Admin Panel - Frontend

## Các tính năng đã được cập nhật

### 1. Dashboard (Trang tổng quan)

**Tính năng mới:**
- Hiển thị số lượng công việc (jobs) trong hệ thống
- Hiển thị số lượng công việc đang hoạt động
- Thống kê tổng quan về người dùng và vai trò

**Các thống kê hiển thị:**
- Tổng số người dùng
- Người dùng đang hoạt động
- Người dùng bị khóa
- Tổng số vai trò
- Tổng số công việc
- Công việc đang hoạt động

### 2. Quản lý người dùng (User Management)

**Tính năng đã cải thiện:**

#### Hiển thị thông tin:
- ID người dùng (8 ký tự cuối)
- Tên đầy đủ và email
- Số điện thoại
- Vai trò hiện tại (với màu sắc phân biệt)
- Trạng thái hoạt động

#### Thống kê tổng quan:
- Tổng số người dùng
- Số người dùng đang hoạt động
- Số người dùng bị khóa

#### Tính năng quản lý:

**Ban/Unban người dùng:**
- Nút "Khóa" cho người dùng đang hoạt động
- Nút "Mở khóa" cho người dùng bị khóa
- Xác nhận trước khi thực hiện hành động
- Hiển thị tên người dùng trong popup xác nhận

**Cập nhật vai trò:**
- Modal cập nhật vai trò với giao diện đẹp
- Hiển thị đầy đủ thông tin người dùng
- Dropdown chọn vai trò với màu sắc phân biệt
- Cảnh báo về tác động của việc thay đổi vai trò

#### Tìm kiếm và lọc:
- Tìm kiếm theo tên, email hoặc vai trò
- Phân trang với tùy chọn số lượng hiển thị
- Nút làm mới dữ liệu

## API Endpoints mới

### Backend (đã thêm):
- `GET /api/admin/jobs` - Lấy danh sách tất cả công việc

### Frontend Services:
- `AdminService.getAllJobs()` - Gọi API lấy danh sách jobs

## Cách sử dụng

### 1. Truy cập Dashboard
- Đăng nhập với tài khoản admin
- Vào trang Dashboard để xem thống kê tổng quan

### 2. Quản lý người dùng
- Vào trang "Quản lý người dùng"
- Xem danh sách tất cả người dùng
- Sử dụng tìm kiếm để lọc người dùng
- Click "Đổi vai trò" để thay đổi vai trò người dùng
- Click "Khóa" hoặc "Mở khóa" để thay đổi trạng thái

### 3. Cập nhật vai trò
- Click nút "Đổi vai trò" trên người dùng cần thay đổi
- Chọn vai trò mới từ dropdown
- Click "Cập nhật" để xác nhận

## Lưu ý quan trọng

1. **Quyền truy cập**: Chỉ admin mới có thể truy cập các tính năng này
2. **Xác nhận hành động**: Tất cả các hành động quan trọng đều có popup xác nhận
3. **Cập nhật real-time**: Dữ liệu sẽ được làm mới sau mỗi hành động
4. **Responsive**: Giao diện hỗ trợ đầy đủ trên mobile và desktop

## Màu sắc phân biệt vai trò

- **Admin**: Đỏ (red)
- **Recruiter**: Xanh dương (blue)  
- **User**: Xanh lá (green)
- **Khác**: Mặc định (default)

## Trạng thái người dùng

- **Hoạt động**: Xanh lá (green)
- **Bị khóa**: Đỏ (red)


