# MERCURIOS // TỔNG HỢP CẬP NHẬT, LƯU Ý, QUY ĐỊNH VÀ THAY ĐỔI

> **Tài liệu bàn giao & Quy chuẩn kỹ thuật toàn diện cho hệ sinh thái vận hành MercuriOS**  
> *Thời gian cập nhật gần nhất: 23/09/2026*  
> *Phụ trách: MercuriOS Core Engineering Team*

---

## 1. TỔNG QUAN HỆ THỐNG & ĐỊNH HƯỚNG PHÁT TRIỂN

* **MercuriOS** là hệ điều hành vận hành dành riêng cho chuỗi bán lẻ thời trang đa kênh, kho bãi thông minh và quản trị sản xuất xưởng may (lấy cảm hứng từ chuẩn mực giao diện cao cấp *HEIN ONE - FASHION OS*).
* **Mục tiêu kiến trúc**:
  * Tốc độ phản hồi cực đại (0ms SPA transition), hoàn toàn không có độ trễ tải trang.
  * Thiết kế tối giản tinh tế (Minimalist & Functional), tập trung vào dữ liệu nghiệp vụ, không rườm rà.
  * Mã nguồn được module hóa cao độ, sẵn sàng chuyển đổi (migrate) lên **React / Vite / Vue / TypeScript** trong tương lai mà không cần đập đi xây lại từ đầu.

---

## 2. QUY ĐỊNH PHÂN CHIA THƯ MỤC DỰ ÁN & VÙNG CẤM

```
f:/Mercuri/
├── Mercurios/   --> [CHO PHÉP] Toàn bộ mã nguồn giao diện, CSS, JS, UI components và tài liệu vận hành
└── Mercurix/    --> [VÙNG CẤM TUYỆT ĐỐI] Dành riêng cho Ban AI & Tự động hóa
```

* **`f:/Mercuri/Mercurios/`**: Thư mục làm việc chính của đội ngũ giao diện. Mọi file HTML, CSS, JavaScript, assets và tài liệu kỹ thuật bắt buộc phải được đặt trong thư mục này.
* **`f:/Mercuri/Mercurix/`**: Khu vực độc quyền của **Ban AI (`Mercurix`)**. 
  * **Quy định bất khả xâm phạm**: Tuyệt đối **không can thiệp, không tạo mới, không sửa đổi hay xóa** bất kỳ tệp tin/thư mục nào bên trong `Mercurix`.
  * Ban AI sẽ độc lập phát triển các worker thông minh, model dự báo nhu cầu (demand forecasting), tự động hóa định tuyến đơn hàng và giao tiếp với MercuriOS thông qua cổng cầu nối `window.Mercurios` (Mercurix Bridge).

---

## 3. QUY CHUẨN THIẾT KẾ CỐT LÕI (DESIGN SYSTEM & UI/UX RULES)

### 3.1. Triệt để Zero-Icon (Hoàn toàn không dùng icon đồ họa)
* **Tuyệt đối không sử dụng icon hình ảnh** (không icon SVG, không font icon, không emoji màu, không hình túi xách, giỏ hàng, đồng tiền, nhà xưởng, bút chì, thùng rác...).
* **Thay thế 100% bằng Typography sắc nét kết hợp với các Mã Tag kỹ thuật chuẩn hóa**:
  * **Mã điểm kho / Cửa hàng**: `[WH-01]`, `[WH-02]`, `[ST-01]`, `[ALL_NODES]`
  * **Mã thực thể nghiệp vụ**: `[SKU]`, `[PO]`, `[ORD]`, `[CAT]`, `[COL]`, `[MAT]`, `[CRM]`, `[WMS]`
  * **Trạng thái quy trình**: `[ACTIVE]`, `[PLANNING]`, `[DESIGN]`, `[SAMPLE]`, `[URGENT]`, `[PENDING]`, `[COMPLETED]`
  * **Nút hành động kỹ thuật**: `[EDIT]`, `[DELETE]`, `[EXECUTE]`, `+ Add Product`, `+ New Dispatch`

### 3.2. Bảng màu Đơn sắc (Monochrome) & Dịu mắt
* **Light Mode (Chế độ mặc định)**: 
  * Sử dụng tông nền xám tro kỹ thuật dịu mắt (`#F6F7F9`), thẻ nội dung trắng tinh (`#FFFFFF`), đường viền siêu mảnh tao nhã (`#E4E7EB`).
  * Màu chữ: Đen than công nghiệp (`#111418`) cho tiêu đề và giá trị chính; xám chì trung tính (`#5E6773`) cho nhãn phụ và chú thích.
  * Không dùng hiệu ứng đổ bóng (box-shadow) nặng nề hay dải màu gradient sặc sỡ làm mỏi mắt khi vận hành nhiều giờ.
* **Dark Mode (Velvet Charcoal)**:
  * Nền đen than nhung dịu mắt (`#0E1012`), bề mặt card `#181B1F`, viền xám đậm `#252A31`, chữ `#E6EDF3`.
  * Bộ chuyển đổi Theme (Dark/Light) được tích hợp trong trang **Settings**.

### 3.3. Tiêu đề bằng Tiếng Anh súc tích
* Tất cả menu chính, tiêu đề trang và phân nhóm phân hệ bắt buộc dùng tiếng Anh ngắn gọn, chuẩn ngành thời trang quốc tế:
  * `OVERVIEW`, `PRODUCTS`, `CATEGORIES`, `COLLECTIONS`, `RAW MATERIALS`, `SETTINGS`.

### 3.4. Bố cục thoáng đãng, giãn cách khoa học (Tránh chen chúc, nhỏ hẹp)
* **Kích thước & Khoảng đệm**: 
  * Tăng khoảng cách lề và padding giữa các khối nghiệp vụ lên tối thiểu `24px - 32px`.
  * Font chữ to rõ, độ tương phản cao (sử dụng font **Plus Jakarta Sans** cho giao diện tổng quan và **JetBrains Mono** cho các mã SKU/số liệu kỹ thuật).
* **Quy chuẩn lưới (Grid System)**:
  * Trang Dashboard (`OVERVIEW`): Lưới 3 thẻ lớn mỗi hàng (`repeat(3, 1fr)`).
  * Trang Sản phẩm (`PRODUCTS`): Lưới 4 thẻ thống kê nhanh trên đầu trang (`repeat(4, 1fr)`).
  * Chiều cao hàng trong bảng dữ liệu: Tối thiểu `44px - 48px`, dòng kẻ mảnh, chữ số căn phải thẳng hàng.

### 3.5. Thanh Sidebar cố định tuyệt đối (Fixed 100vh - Không cuộn trượt)
* Chiều rộng cố định: `250px`.
* **Quy định quan trọng**: Chiều cao toàn bộ sidebar được tối ưu gọn gàng trong ~`570px`, cài đặt thuộc tính `overflow: hidden;`.
* Sidebar luôn nằm cố định bên trái màn hình, **tuyệt đối không bị trượt lên xuống, không sinh thanh cuộn dọc (scrollbar)** trên bất kỳ độ phân giải màn hình nào (từ laptop 768p/800p đến màn hình lớn 1080p/4K).

### 3.6. Thanh Header (Topbar) tối giản & Gọn gàng
* **Trạng thái hệ thống**: Tối giản thành chấm tín hiệu **`● LIVE`** (không hiển thị chuỗi giờ giấc dài dòng). Bấm vào để đổi nhanh giữa `LIVE` và `OFF`.
* **Khối thông tin người dùng**: Tối giản gồm `Hoang Huu Nguyen`, nhãn vai trò `Admin`, Avatar ký tự tròn `H`, vách ngăn phân cách `|` và nút chữ `Sign Out`.
* **Tuyệt đối không lặp lại nút Settings trên Topbar**: Chức năng cài đặt chỉ nằm duy nhất tại mục `Settings` ở thanh Sidebar.

### 3.7. Vị trí Bộ chọn Điểm vận hành / Kho bãi (Operational Node Selector)
* Nhằm giữ Dashboard chính luôn tinh gọn và tập trung vào **Kho tổng (`Central Hub [WH-01]`)**, bộ chọn điểm kho/chi nhánh (`Operational Hub`) đã được chuyển vào bên trong mục **Your Account** tại trang **Settings**.
* Tại đây, người quản trị có thể dễ dàng chuyển đổi góc nhìn báo cáo giữa `Central Hub [WH-01]`, `E-Commerce Hub [WH-02]`, `Flagship Store [ST-01]` hoặc `All Consolidated Nodes [ALL_NODES]`.

### 3.8. Cơ chế kiểm soát Thông báo (Toast Notification Rules)
* **Chống lặp thông báo (Deduplication)**: Nếu người dùng bấm lại tab màn hình đang mở hoặc bấm cùng một thao tác liên tục, hệ thống sẽ chặn không cho phát sinh thêm thông báo thừa.
* **Tự động giảm thời gian hiển thị khi click nhanh (Rapid-click Dampening)**: Khi phát hiện thao tác liên tục nhiều lần, thời gian toast lưu lại trên màn hình tự động giảm từ 2.8s xuống còn 1.4s để không che khuất tầm nhìn làm việc.
* **Giới hạn số lượng**: Tối đa 3 thông báo hiển thị cùng thời điểm. Thông báo mới nhất sẽ đẩy thông báo cũ đi nếu vượt quá giới hạn.

---

## 4. THÔNG TIN QUẢN TRỊ VIÊN & PHÂN QUYỀN HỆ THỐNG

| Thuộc tính | Giá trị chuẩn hóa |
| :--- | :--- |
| **Họ và tên Quản trị viên** | **`Hoang Huu Nguyen`** |
| **Chức danh / Phân quyền** | **`Admin`** (Toàn quyền quản trị hệ thống) |
| **Ký tự Avatar** | **`H`** (Hình tròn nền trắng xám) |
| **Số điện thoại định danh** | **`0967676767`** |
| **Email liên hệ** | `admin@mercuri.vn` |
| **Điểm vận hành mặc định** | **`Central Hub [WH-01]`** (Kho tổng trung tâm) |

---

## 5. QUY ĐỊNH CẤU TRÚC CODE & MODULE HÓA (CLEAN & MODULAR ARCHITECTURE)

> **QUY TẮC BẮT BUỘC ĐỐI VỚI MÃ NGUỒN**:
> Tuyệt đối **không gộp chung toàn bộ code vào một file dài**. Mọi tính năng, màn hình và thành phần đều phải được chia nhỏ thành từng file riêng biệt, có chú thích rõ ràng. Điều này giúp mã nguồn luôn sạch sẽ, dễ dàng debug và tránh xung đột khi làm việc nhóm.

### Cây cấu trúc mã nguồn hiện tại:
```
f:/Mercuri/Mercurios/
├── index.html                               # Khung xương semantic kết nối các module
├── server.js                                # Máy chủ dev nội bộ (Node.js, cổng 5173)
├── ghichu.md                                # File tài liệu lưu ý, quy định và cập nhật
│
├── styles/                                  # TẬP HỢP CÁC FILE CSS PHÂN HỆ RIÊNG BIỆT
│   ├── variables.css                        # Tokens màu sắc Light/Dark, typography, bo góc, transition
│   ├── layout.css                           # Bố cục App: Sidebar cố định (250px), Topbar, Canvas cuộn
│   ├── components.css                       # Thành phần tái sử dụng: Nút bấm, Thẻ KPI, Bảng dữ liệu, Badges, Toasts
│   ├── modals.css                           # Hộp thoại Modal: Xuất kho khẩn cấp, Thêm sản phẩm
│   ├── overview.css                         # CSS chuyên biệt cho Dashboard (Biểu đồ cột doanh thu, tiến độ đơn)
│   ├── products.css                         # CSS chuyên biệt cho Products (Thanh công cụ, bộ lọc, bảng sản phẩm)
│   ├── settings.css                         # CSS chuyên biệt cho Settings (Khung profile 2 cột, danh sách 13 module)
│   └── main.css                             # File chỉ mục (CSS Manifest) import toàn bộ các file CSS trên
│
└── scripts/                                 # TẬP HỢP CÁC FILE JAVASCRIPT ĐỘC LẬP
    ├── state.js                             # Store dữ liệu trung tâm (Financials, Products, Hubs, Orders, Materials)
    ├── mercurix-bridge.js                   # Cổng API Bridge toàn cầu cho ban AI Mercurix tích hợp
    ├── app.js                               # Bootstrapper ngắn gọn (~20 dòng) khởi động hệ thống
    │
    ├── components/                          # CONTROLLER ĐIỀU KHIỂN CÁC THÀNH PHẦN GIAO DIỆN
    │   ├── toast.js                         # Hệ thống thông báo (chống trùng lặp, chống spam, giới hạn 3 items)
    │   ├── topbar.js                        # Điều khiển Topbar (Bật/tắt Live, hiển thị Admin Hoang Huu Nguyen)
    │   ├── sidebar.js                       # Điều khiển Sidebar & chuyển màn hình (SPA Routing 0ms)
    │   ├── modals.js                        # Điều khiển đóng/mở và xử lý submit form trong các Modals
    │   └── channel-breakdown.js             # Widget biểu đồ tỷ trọng kênh (Shopee, TikTok Shop, Outlets)
    │
    └── views/                               # CONTROLLER LOGIC RIÊNG CHO TỪNG TRANG MÀN HÌNH
        ├── overview.js                      # Logic Dashboard (Số liệu tài chính, xuất kho tức thì)
        ├── products.js                      # Logic Sản phẩm (Tìm kiếm thời gian thực, lọc trạng thái, thêm/xóa SKU)
        ├── categories.js                    # Logic Danh mục (Cây phân loại sản phẩm: Áo, Quần, Váy, Đầm...)
        ├── collections.js                   # Logic Bộ sưu tập (Kế hoạch ra mắt theo mùa: Holiday, SS26, FW26...)
        ├── materials.js                     # Logic Nguyên phụ liệu (Vải, chỉ may, khuy bấm, khóa kéo YKK...)
        └── settings.js                      # Logic Cài đặt (Chọn Hub vận hành, đổi giao diện Dark/Light, profile)
```

---

## 6. KHẢ NĂNG CHUYỂN ĐỔI SANG REACT / VITE / VUE / TYPESCRIPT TRONG TƯƠNG LAI

> **Giải đáp thắc mắc**: *"Nếu xây dựng theo mô hình thuần Vanilla hiện tại, sau này muốn chuyển đổi sang React/Vite hoặc Vue, TypeScript thì có phải làm lại từ đầu không?"*

### Câu trả lời: **HOÀN TOÀN KHÔNG PHẢI LÀM LẠI TỪ ĐẦU!**

Kiến trúc hiện tại của MercuriOS đã được thiết kế tuân theo **nguyên lý Hướng Thành Phần (Component-Driven)** và **Phân tách Độc lập Trạng thái (Decoupled State Management)**:
1. **Dữ liệu đã được gom vào Store trung tâm (`scripts/state.js`)**:
   * Khi chuyển sang React, file này chuyển đổi 1-1 thành `Zustand store` hoặc `Redux toolkit slice` chỉ trong 10 phút.
2. **Giao diện đã chia thành từng View và Component độc lập**:
   * Mỗi file trong `scripts/views/` (như `overview.js`, `products.js`, `settings.js`) tương ứng chính xác với một component React (`OverviewView.tsx`, `ProductsView.tsx`, `SettingsView.tsx`).
   * Hàm `render()` dạng chuỗi HTML template string hiện tại có thể copy trực tiếp vào phần return JSX của React mà không cần thiết kế lại cấu trúc.
3. **Toàn bộ hệ thống CSS Tokens (`styles/variables.css` & CSS Modules)**:
   * Giữ nguyên 100%, có thể sử dụng trực tiếp trong dự án Vite/Next.js thông qua CSS Modules hoặc Tailwind CSS (nếu cần).
4. **TypeScript Definitions**:
   * Cấu trúc đối tượng trong `state.js` đã được định nghĩa kiểu dữ liệu mẫu chuẩn hóa, dễ dàng viết các interface `Product`, `Category`, `Collection`, `Material`, `Order` trong file `types.ts`.

---

## 7. CỔNG GIAO TIẾP CHO BAN AI (`MERCURIX BRIDGE`)

Đối tượng toàn cầu **`window.Mercurios`** cung cấp giao diện lập trình ứng dụng (API) mở cho ban AI `Mercurix`:

* `window.Mercurios.getState()`: Trích xuất toàn bộ dữ liệu trạng thái hệ thống.
* `window.Mercurios.switchView(viewName)`: Ra lệnh chuyển màn hình giao diện từ xa (`'overview'`, `'products'`, `'categories'`, `'collections'`, `'materials'`, `'settings'`).
* `window.Mercurios.switchNode(nodeId)`: Đổi điểm vận hành đang theo dõi (`'HUB_01'`, `'ECOM_01'`, `'ALL_NODES'`).
* `window.Mercurios.dispatchStock(payload)`: Tự động khởi tạo lệnh điều chuyển kho khẩn cấp do AI tính toán.
* `window.Mercurios.setMetric(category, key, value)`: Cập nhật chỉ số phân tích hoặc dự báo mới.
* `window.Mercurios.registerModule(containerSelector, renderFn)`: Cho phép AI nhúng thêm các widget biểu đồ tự động vào màn hình.
* `window.Mercurios.onStateChange(callback)`: Đăng ký hàm callback lắng nghe sự kiện thay đổi dữ liệu thời gian thực.

---

## 8. LỊCH SỬ THAY ĐỔI & NHẬT KÝ NÂNG CẤP (CHANGELOG)

* **v1.0.0**: Khởi tạo nền tảng MercuriOS, định hình bộ quy chuẩn Zero-Icon và phong cách Monochrome dịu mắt.
* **v1.1.0**: Mở rộng không gian hiển thị, nâng cấp font chữ Plus Jakarta Sans to rõ, bố cục Dashboard chia lưới 3 cột thoáng đãng.
* **v1.2.0**: Tối giản thanh Topbar: bỏ nút Settings trùng lặp, thêm nút Sign Out, chuẩn hóa thông tin cá nhân: **Hoang Huu Nguyen (Admin)**, SĐT **0967676767**.
* **v1.3.0**: Xây dựng màn hình **Products** (4 thẻ KPI tóm tắt, tìm kiếm tức thì, 3 bộ lọc dropdown, bảng quản lý kiểu dáng SKU, modal thêm sản phẩm).
* **v1.4.0**: Xây dựng màn hình **Settings** bám sát mẫu thiết kế, tích hợp bộ chọn điểm kho (Operational Node Selector) vào mục Your Account, hiển thị danh mục 13 module vận hành.
* **v1.5.0**: Tái cấu trúc mã nguồn toàn diện: tách nhỏ toàn bộ CSS và JavaScript thành từng file độc lập theo mô hình module hóa (`styles/`, `scripts/components/`, `scripts/views/`).
* **v1.6.0**: Hoàn thiện toàn bộ các màn hình trong phân hệ Sản phẩm & Thiết kế:
  * **Categories**: Phân loại danh mục hàng thời trang (Áo, Quần, Đầm, Set bộ, Áo khoác...).
  * **Collections**: Kế hoạch bộ sưu tập theo mùa (Holiday 2026, FW26 Minimal, Silk Capsule, SS26 Preview).
  * **Raw Materials**: Sổ cái nguyên phụ liệu may mặc, định mức vải tồn kho và đơn giá nhà cung cấp.
* **v1.7.0**: 
  * Cố định tuyệt đối thanh Sidebar: thu gọn padding và margin dọc, đặt `overflow: hidden;`, chiều cao vừa vặn ~570px, triệt tiêu hoàn toàn hiện tượng trượt/cuộn lên xuống.
  * Tối ưu hệ thống Toast thông báo: chặn thông báo trùng khi bấm lại tab đang mở, giảm thời gian hiển thị xuống 1.4s khi người dùng thao tác bấm liên tục, giới hạn tối đa 3 toasts cùng lúc.
* **v1.8.0**: Tổng hợp toàn bộ tài liệu kỹ thuật, quy định thiết kế, quy chuẩn phân chia thư mục và lộ trình chuyển đổi framework vào file **`ghichu.md`**.
* **v1.9.0**: Hoàn thiện toàn diện phân hệ **Bán hàng (Sales & Orders)** theo chuẩn thiết kế Minimalist:
  * **Orders**: Bảng dữ liệu đơn hàng đa kênh, mã màu thanh toán (`[PAID]`, `[UNPAID]`, `[REFUNDED]`), bộ lọc đa chiều theo trạng thái/kênh/thanh toán.
  * **Customers (CRM 360°)**: Quản lý khách hàng, phân hạng thẻ thành viên (`[VIP]`, `[DIAMOND]`, `[GOLD]`, `[SILVER]`), tích lũy điểm thưởng và giá trị vòng đời khách.
  * **Omnichannel Inbox & Mercurix AI Copilot**: Tối giản hóa triệt để hộp thư đa kênh, triệt tiêu sự rối mắt của bản mẫu:
    * Khung chat thoáng đãng 2 cột chính (Danh bạ hội thoại & Cửa sổ chat rộng rãi).
    * Ngăn kéo trượt (Slide-over Drawer) linh hoạt được ẩn mặc định, mở ra bằng nút **`[CRM & AI COPILOT]`** để xem CRM info, ghi chú nội bộ hoặc bảng điều khiển AI mà không làm chật chội màn hình.
    * Tích hợp **AI Autopilot** (`● AI AUTOPILOT: ON/OFF`), đề xuất phản hồi thông minh (`[MERCURIX COPILOT SUGGESTION]`) và công cụ **Giả lập tin nhắn khách hàng (AI Simulator)** phục vụ việc kiểm thử model của Ban AI Mercurix.
    * Cung cấp API lập trình `window.Mercurios.inbox` dành riêng cho hệ thống AI Mercurix.


---

## 9. HƯỚNG DẪN KHỞI CHẠY & KIỂM THỬ HỆ THỐNG

1. **Khởi động máy chủ xem trước nội bộ (Local Dev Server)**:
   Mở terminal tại thư mục dự án và chạy:
   ```bash
   node server.js
   ```
2. **Truy cập ứng dụng**:
   Mở trình duyệt bất kỳ (Chrome, Edge, Firefox, Safari) tại địa chỉ:
   ```
   http://localhost:5173
   ```
3. **Hiệu năng & Tương thích**:
   * Hệ thống vận hành ở chế độ Native Vanilla ES6+, không cần cài đặt node_modules phức tạp.
   * Tải trang và chuyển đổi tab tức thì với độ trễ 0ms.
