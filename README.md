# Website Bán Hàng

## Nhóm 6:
Thành viên:
1. Hà Như Ý - 22022636
2. Nguyễn Mạnh Cường - 22022516
3. Đoàn Nhật Bình - 22022543

Link báo cáo, video demo: [Tại đây]()

<img src='MainPage3.png' width='600px'/>

## Tổng quan
Website Bán Hàng là một nền tảng mua sắm trực tuyến hiệu quả và tiện lợi, kết hợp giữa giao diện người dùng thân thiện và các công nghệ hiện đại. Dự án nhằm nâng cao trải nghiệm mua sắm của người dùng và tạo điều kiện thuận lợi cho doanh nghiệp trong việc quản lý sản phẩm và đơn hàng.

## Tính năng
- **Quản lý Sản phẩm**: Thêm, chỉnh sửa, xóa, và xem chi tiết sản phẩm.
- **Quản lý Người dùng**: Đăng ký, đăng nhập, và quản lý hồ sơ cá nhân.
- **Gợi ý sản phẩm**: Tạo gợi ý dựa trên hành vi người dùng.
- **Giỏ hàng và Thanh toán**: Quản lý giỏ hàng và xử lý thanh toán an toàn.
- **Theo dõi Đơn hàng**: Kiểm tra trạng thái và tiến trình đơn hàng.
- **Chuyển đổi ngôn ngữ**: Hỗ trợ đa ngôn ngữ (tiếng Anh và tiếng Việt).

## Yêu cầu hệ thống
- Node.js
- PostgreSQL
- Docker (tùy chọn)

### Hướng Dẫn Cài Đặt

1. Clone repository:

    ```bash
    git clone https://github.com/username/repository.git
    cd repository
    ```

2. Cài đặt các gói phụ thuộc:

    ```bash
    npm install
    ```

3. Cấu hình cơ sở dữ liệu:

    - Tạo một file `.env` trong thư mục gốc và thêm các biến môi trường sau:

    ```env
    DATABASE_URL=mongodb://localhost:27017/database_name
    SECRET_KEY=your_secret_key
    ```

4. Khởi chạy ứng dụng:

    ```bash
    npm start
    ```

5. Truy cập ứng dụng tại `http://localhost:3000`.

## Hướng dẫn sử dụng
- **Đăng ký/Đăng nhập**: Người dùng có thể tạo tài khoản và đăng nhập để sử dụng các dịch vụ của trang web.
- **Quản lý sản phẩm**: Quản trị viên có thể thêm, chỉnh sửa, xóa sản phẩm từ bảng điều khiển.
- **Mua hàng**: Người dùng có thể thêm sản phẩm vào giỏ hàng, cập nhật số lượng và tiến hành thanh toán.
- **Theo dõi đơn hàng**: Kiểm tra trạng thái và tiến trình giao hàng của đơn hàng đã đặt.

## Đóng góp
Nếu bạn muốn đóng góp vào dự án này, vui lòng làm theo các bước sau:
1. Fork dự án.
2. Tạo một nhánh tính năng mới (`git checkout -b feature/AmazingFeature`).
3. Commit các thay đổi của bạn (`git commit -m 'Add some AmazingFeature'`).
4. Push nhánh của bạn (`git push origin feature/AmazingFeature`).
5. Mở một Pull Request.

## Giấy phép
Dự án này được cấp phép theo giấy phép MIT. Xem tệp [LICENSE](LICENSE) để biết thêm chi tiết.

## Thông tin liên hệ
Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email: 📧.mmm....support@example.com.
