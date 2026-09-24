# MERCURI // Unified Fashion OS & AI Operations Suite

> **Hệ điều hành vận hành thời trang đa kênh (MercuriOS) kết hợp Trợ lý Tác tử AI Vận hành Độc lập (Mercurix)**  
> Thiết kế chuẩn mực, hiệu năng cao, tối giản và tự động hóa toàn diện quy trình chuỗi bán lẻ, kho hàng và xưởng may.

---

![MercuriOS Overview & Mercurix Operations Assistant](assets/mercurios-overview.png)

---

## 🌟 Tổng Quan Hệ Thống

Dự án **Mercuri** là giải pháp toàn diện cho ngành công nghiệp bán lẻ và sản xuất thời trang, bao gồm hai phân hệ được phân tầng rạch ròi:

```
f:/Mercuri/
├── Mercurix/    --> [BỘ NÃO AI & TÁC TỬ] Toàn bộ suy luận ReAct, nhận thức ngữ cảnh & bộ công cụ an toàn
│   ├── docs/    --> Hồ sơ nghiên cứu, RFC, ADRs và đặc tả kỹ thuật chi tiết
│   └── src/     --> Mã nguồn thực thi bộ não AI (Context Engine, Action Catalog, Brain Core)
└── Mercurios/   --> [GIAO DIỆN & HỆ THỐNG] Vỏ Drawer Messenger 420px, CSS, View Tables, State & Server
```

---

## 🚀 Các Tính Năng Nổi Bật

### 1. MercuriOS — Fashion Operating System
* **Bàn làm việc Tổng quan (Dashboard Overview)**: Đo lường doanh thu gộp, tỷ lệ an toàn tồn kho, số lượng đơn hoàn tất theo thời gian thực.
* **Quản trị Sản phẩm & Thiết kế (Catalog & Design)**: Ma trận kích thước và màu sắc, danh mục sản phẩm, bộ sưu tập theo mùa (Spring/Summer/Fall/Winter/Capsule) và kho nguyên phụ liệu.
* **Bán hàng & Đơn hàng Đa kênh (Sales & Omnichannel Orders)**: Hợp nhất đơn hàng từ cửa hàng Flagship (POS), Website, Shopee, TikTok Shop, Facebook, Lazada.
* **Quản trị Tồn kho & Điều chuyển (Inventory & WMS)**: Giám sát ngưỡng an toàn tồn kho, quản lý 9 chi nhánh bán lẻ và 2 kho trung tâm (Central Hub HCM [WH-01], Ecom Hub [WH-02]).
* **Hộp thư Đa kênh (Omnichannel Inbox)**: Quản lý hội thoại khách hàng tập trung với chế độ trợ lý AI thông minh (AI Autopilot).
* **Quản trị Sản xuất & Xưởng may (Production MES)**: Theo dõi tiến độ lệnh sản xuất (Cutting, Sewing, QC, Packaging).
* **Hỗ trợ Giao diện Tối / Sáng (Dark & Light Mode)**: Thiết kế Velvet Charcoal cao cấp, bảo vệ mắt và tối ưu tương phản.

### 2. Mercurix — Trợ Lý Tác Tử Vận Hành AI (Fashion Operations Assistant)
* **Giao diện Messenger Mini Tinh Gọn**: Khung chat nổi góc dưới bên phải màn hình, không che mờ nội dung đang làm việc, mở/đóng tức thì bằng phím tắt `Ctrl + Space` hoặc biểu tượng nổi `MX`.
* **Nhận thức Ngữ cảnh Phẳng (`PageContext`)**: Nắm rõ người dùng đang ở màn hình nào để đưa ra phản hồi chính xác.
* **Chốt chặn Hành động An toàn (`Action Catalog` & `Action Gate`)**: Cơ chế Whitelist & Fail-Closed, kiểm soát tuyệt đối các tác vụ được phép gọi (`ui.navigate`, `ui.open_form`, `ops.filter_table`, `ops.filter_dropdown`, `ops.query_data`, `ui.set_theme`, `ui.trigger_action`, `ops.delete_record`).
* **Con Người Bấm Nút Cuối Cùng (Human-in-the-Loop)**: Mọi thao tác đột biến nhạy cảm (như xóa đơn hàng) bắt buộc phải hỏi xác nhận chi tiết từ người dùng trước khi thực thi.
* **Hỏi Lại Thông Minh (Contextual Clarification)**: Không sử dụng phản hồi rập khuôn cố định; phân tích hành vi để hỏi lại đúng trọng tâm khi người dùng nhập thiếu dữ kiện.

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Thử

### Yêu cầu môi trường
* Node.js (phiên bản 18+ hoặc 20+)
* Trình duyệt hiện đại (Chrome, Edge, Firefox, Safari)

### Khởi chạy hệ thống
1. Di chuyển vào thư mục `Mercurios/`:
   ```bash
   cd Mercurios
   ```
2. Khởi chạy máy chủ HTTP:
   ```bash
   node server.js
   ```
3. Mở trình duyệt và truy cập:
   ```
   http://localhost:5173/index.html
   ```

---

## 📚 Tài Liệu Kỹ Thuật

* [Mercurix Documentation](Mercurix/docs/README.md): Hồ sơ RFC, ADRs kiến trúc và đặc tả chi tiết.
* [Mercurix Architecture Notes](Mercurix/ghichu_mercurix.md): Ghi chú quy chuẩn kỹ thuật cho bộ não AI.
* [MercuriOS Implementation Notes](Mercurios/ghichu_mercurios.md): Ghi chú bàn giao phân hệ giao diện và lõi vận hành.

---

© 2026 Mercuri OS. All rights reserved.
