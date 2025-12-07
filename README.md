# Jurni – Website đặt và quản lý tour du lịch

## 1. Giới thiệu
Jurni là nền tảng hỗ trợ tìm kiếm, xem chi tiết và đặt tour du lịch trực tuyến.  
Dự án được phát triển cho Đồ án chuyên ngành Công nghệ phần mềm với mục tiêu xây dựng một hệ thống *nhanh*, *an toàn*, *dễ sử dụng* và *phù hợp với người dùng Việt Nam*.

Hệ thống được xây dựng theo kiến trúc MVC, gồm:
- Frontend (ReactJS + Tailwind)
- Backend (Node.js + Express)
- Database (MySQL)

---

## 2. Công nghệ sử dụng

### Backend
- Node.js  
- Express.js  
- Axios  
- Clerk (xác thực & phân quyền người dùng)

### Frontend
- ReactJS  
- TailwindCSS  

### Database
- MySQL  
- ERD theo mô hình cơ sở dữ liệu quan hệ  

### Kiến trúc hệ thống
- MVC – Model, View, Controller  

---

## 3. Tính năng chính

### 3.1 Dành cho người dùng
- Tìm kiếm, lọc và xem chi tiết tour  
- Đặt tour trực tuyến  
- Quản lý thông tin tài khoản  
- Xem lịch sử đặt tour  
- Đăng ký/đăng nhập bằng Clerk  
- Trải nghiệm UI/UX tối ưu cho thiết bị di động

### 3.2 Dành cho quản trị viên
Hệ thống quản trị được phân thành *3 cấp độ*:

| Cấp độ | Quyền hạn |
|-------|-----------|
| Admin bậc 1 | Toàn quyền hệ thống |
| Admin bậc 2 | Quản lý tour, người dùng, đơn đặt; không được quản lý admin khác |
| Admin bậc 3 | Quản lý và duyệt tour |

Các chức năng quản trị:
- Quản lý tour (thêm – sửa – xóa)  
- Quản lý người dùng  
- Quản lý đơn đặt tour  
- Theo dõi trạng thái xử lý  
- Kiểm tra lịch sử hoạt động hệ thống  

---

## 4. Thành viên thực hiện

| STT | Họ và tên | MSSV | Vai trò | Nhiệm vụ |
|-----|-----------|-------|---------|----------|
| *1* | Nguyễn Khắc Minh Hiếu | 2280607474 | Backend chính | Thiết kế API, phân quyền Clerk, quản lý logic nghiệp vụ tour – booking, tích hợp thanh toán, middleware bảo mật |
| *2* | Lê Đại Thanh Long | 2280601752 | Frontend chính | Xây dựng UI ReactJS + Tailwind, giao diện trang chủ – chi tiết tour – đặt tour, kết nối API bằng Axios, responsive đa nền tảng |
| *3* | Nguyễn Huy Sơn | 2280602756 | Database & Tester | Thiết kế ERD + MySQL schema, tạo dữ liệu mẫu, kiểm thử API bằng Postman, viết test case tính năng đặt tour & phân quyền |

---
