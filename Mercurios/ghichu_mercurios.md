# MERCURIOS // TỔNG HỢP KIẾN TRÚC, GIAO DIỆN VÀ VẬN HÀNH HỆ THỐNG

> **Tài liệu bàn giao & Quy chuẩn kỹ thuật toàn diện cho Giao diện & Hệ thống Vận hành MercuriOS**  
> *Tài liệu độc quyền của Bộ não Tác tử AI đặt tại: [`../Mercurix/ghichu_mercurix.md`](../Mercurix/ghichu_mercurix.md)*  
> *Thời gian cập nhật gần nhất: 24/09/2026*  
> *Phụ trách: MercuriOS Core Engineering Team*

---

## 1. TỔNG QUAN HỆ THỐNG & ĐỊNH HƯỚNG PHÁT TRIỂN

* **MercuriOS** là hệ điều hành vận hành dành riêng cho chuỗi bán lẻ thời trang đa kênh, kho bãi thông minh và quản trị sản xuất xưởng may (lấy cảm hứng từ chuẩn mực giao diện cao cấp *HEIN ONE - FASHION OS*).
* **Mục tiêu kiến trúc**:
  * Tốc độ phản hồi cực đại (0ms SPA transition), hoàn toàn không có độ trễ tải trang.
  * Thiết kế tối giản tinh tế (Minimalist & Functional), tập trung vào dữ liệu nghiệp vụ, không rườm rà.
  * Mã nguồn được module hóa cao độ, sẵn sàng chuyển đổi (migrate) lên **React / Vite / Vue / TypeScript** trong tương lai mà không cần đập đi xây lại từ đầu.

---

## 2. QUY ĐỊNH PHÂN CHIA THƯ MỤC DỰ ÁN & RANH GIỚI KIẾN TRÚC

```
f:/Mercuri/
├── Mercurix/    --> [BỘ NÃO AI & TÁC TỬ] Logic suy luận ReAct, Intent Parser, Action Catalog, Context Engine
└── Mercurios/   --> [GIAO DIỆN & HỆ THỐNG] Toàn bộ mã nguồn giao diện UI, CSS, Views, State, Server
```

* **`f:/Mercuri/Mercurix/`**: Khu vực độc quyền chứa **Bộ não & Năng lực của AI**:
  * `src/context-engine.js`: Nhận thức ngữ cảnh (`PageContext`), phân tích trạng thái và xuất chip đề xuất hành động.
  * `src/action-catalog.js`: Sổ đăng ký công cụ và chốt chặn an toàn lúc thực thi (`ui.navigate`, `ui.open_form`, `ops.filter_table`...).
  * `src/brain-core.js`: Vòng lặp suy luận ReAct đa bước (Reason ➔ Act ➔ Observe ➔ Repeat), bóc tách thực thể và cấu trúc hóa câu trả lời.
  * `src/index.js`: Xuất giao diện lập trình `window.Mercurix` cho toàn hệ thống.
* **`f:/Mercuri/Mercurios/`**: Thư mục làm việc của **Giao diện & Hệ thống**:
  * Chứa HTML, CSS, hệ thống thẻ hiển thị, View Components, State Management (`state.js`).
  * `scripts/components/agent-drawer.js` đóng vai trò **Pure UI Presentation Harness**: quản lý Floating Launcher màu đen ở góc dưới bên phải (Hình 1 có hiệu ứng sóng xung quanh), khung chat mini nổi phong cách Messenger (Hình 2 - không che mờ nền), nút thu nhỏ `[—]`, đóng `[X]`, xóa đoạn chat `[CLR]`, duy trì lịch sử hội thoại khi ẩn/hiện và tự động làm mới khi F5.
  * `server.js` hỗ trợ định tuyến `/mercurix/...` trỏ trực tiếp sang thư mục `Mercurix/`.

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
* **v1.9.0**: Xây dựng phân hệ Bán hàng (Orders, Customers CRM 360, Omnichannel Inbox cơ bản).
* **v2.0.0**: **Tái thiết kế toàn diện Omnichannel Inbox chuẩn giao diện Facebook Messenger**:
  * **Loại bỏ triệt để các component rườm rà**: Xóa bỏ các thanh telemetry dài dòng và nút bấm thừa thãi ở khu vực tiêu đề, trả lại không gian tối giản, tinh khiết.
  * **Chuẩn hóa bố cục 3 cột kinh điển của Messenger**:
    * **Cột 1 (Chats Directory)**: Danh sách hội thoại với Avatar tròn, chấm tín hiệu online xanh (`#31A24C`), bộ lọc kênh tối giản (`All`, `FB`, `IG`, `Zalo`, `TikTok`, `Shopee`) và thanh tìm kiếm bo tròn nhẹ nhàng.
    * **Cột 2 (Active Chat Thread)**: Khung chat rộng mở với bong bóng chat tròn mềm, thanh nhập liệu dạng pill thanh thoát.
    * **Cột 3 (Customer Profile & Quick FAQ)**: Thẻ hồ sơ khách hàng, chi tiêu tích lũy, công tắc bật/tắt AI Autopilot và danh mục câu trả lời mẫu cho nhân viên.
* **v2.1.0**: **Hoàn thiện 4 phân hệ VẬN HÀNH & Nâng cấp tương tác Omnichannel Inbox**:
  * **Cửa hàng (Stores)**: Danh sách 9 điểm bán lẻ, nhà máy, kho trung tâm, bộ lọc loại cửa hàng + trạng thái, nút thêm cửa hàng.
  * **Tồn kho (Inventory)**: Bảng SKU matrix x kho bãi real-time, bộ lọc theo điểm kho và ngưỡng tồn (cảnh báo tồn thấp < 5).
  * **Lệnh sản xuất (Production MES)**: Theo dõi tiến độ chuyền may, tỷ lệ lỗi, deadline, cost ước tính và trạng thái đơn PO.
  * **Nhà cung cấp (Suppliers)**: Quản lý danh bạ NCC vải, phụ liệu may mặc, gia công CMT, bao bì kèm Lead time & Rating ★.
  * **Tối ưu trải nghiệm Inbox**: Nâng cấp composer thành auto-resizing textarea, phím tắt `Shift + Space` để xuống dòng tự nhiên, tự động ẩn popover mẫu khi xóa `/`, popover giả lập khách nhắn tương tác trực tiếp khi click vào tên/avatar khách.
* **v2.2.0**: **Hoàn thiện phân hệ Nhân viên (`Staff & Access`) & Khắc phục triệt để lỗi Inbox Dark Mode**:
  * **Quản lý Nhân viên & Phân quyền (`Staff & Access`)**:
    * Xây dựng đầy đủ màn hình Nhân viên bám sát mẫu thiết kế thực tế: Quản lý 14 vai trò thời trang (`Designer`, `Production`, `Sales`, `CSKH`, `Marketing`, `Finance`, `HR`...).
    * Bộ lọc tức thì: Ô tìm kiếm tên/email/SĐT + Dropdown 14 vai trò + Dropdown tất cả cửa hàng/chi nhánh.
    * Bảng dữ liệu chuẩn Zero-Icon: Cột TÊN (Avatar Monogram tròn), EMAIL, SĐT, VAI TRÒ (Pill tag), CỬA HÀNG, TT (Đang Hoạt Động), LOGIN CUỐI, THAO TÁC (`[EDIT]`, `[DEL]`).
    * Modal `+ Thêm NV` / Cập nhật NV: Thêm mới hoặc chỉnh sửa thông tin nhân viên, lưu vào Store và cập nhật tức thì.
  * **Khắc phục 5 lỗi giao diện Omnichannel Inbox & Dark Mode**:
    1. *Contrast Bug*: Khắc phục chữ trắng trên nền trắng trong Dark Mode, bong bóng shop/AI sử dụng nền than xanh `#162C46` chữ `#F0F6FC`, bong bóng khách nền than xám `#1F242C` viền `#2E3642`.
    2. *Channel Chip `ALL`*: Thêm quy tắc CSS Dark Mode ép nền trắng chữ đen than `#111418` đậm nét khi active.
    3. *Composer Scrollbar*: Đặt `overflow-y: hidden;` khi dưới 2 dòng để triệt tiêu thanh cuộn dọc thừa `▲ ▼`, thêm `flex-shrink: 0; white-space: nowrap;` cho nút `/ Mẫu trả lời`.
    4. *Nhận diện tin nhắn Shop vs Khách*: Phân chia rõ ràng vị trí và màu sắc kèm tag `[AI]` sắc nét.
    5. *Đồng bộ hóa Sidebar*: Thống nhất 100% ngôn ngữ tiếng Việt thanh điều hướng (`TỔNG QUAN`, `SẢN PHẨM & THIẾT KẾ`, `BÁN HÀNG`, `VẬN HÀNH`, `HỆ THỐNG`).
* **v2.3.0**: **Chuẩn hóa Mã `MER-...`, Nút bấm Collections Style & Chuyển đổi 100% Ngôn ngữ Tiếng Anh**:
  * **Rút gọn đầu mã địa điểm thành `MER-...`**: Đổi toàn bộ mã chuỗi cửa hàng, kho bãi thành `MER-VC-DK`, `MER-SC`, `MER-CRES`, `MER-AEON`, `MER-VC-BT`, `MER-LOTTE`, `MER-WH-HCM`, `MER-WH-ECO`, `MER-FAC`.
  * **Chuẩn hóa nút bấm thao tác theo mẫu Collections**: Chuyển đổi toàn bộ nút thao tác dạng ngoặc vuông sang cặp nút bấm tối giản, thanh lịch: `<button class="btn btn-sm">EDIT</button>` và `<button class="btn btn-sm btn-danger">DELETE</button>` trên toàn bộ các bảng dữ liệu (Outlets & Stores, Production MES, Suppliers & Vendors, Staff & Access).
  * **Chuẩn hóa toàn bộ ngôn ngữ Tiếng Anh (English Localization 100%)**: Đồng bộ toàn diện Sidebar navigation, tiêu đề hero, thanh tìm kiếm & dropdown filters, tiêu đề cột bảng dữ liệu (`CODE`, `STORE NAME`, `TYPE`, `CITY`, `MANAGER`, `PHONE`, `STATUS`, `ACTIONS`...) và hộp thoại modal.

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

---

## 10. NHẬT KÝ LỖI & KẾ HOẠCH BẢO TRÌ (PENDING FIXES & ROADMAP)

> **Cập nhật ngày 24/09/2026**: Toàn bộ các hạng mục trong Section 10 đã được xử lý hoàn tất trong phiên bản **v2.2.0**.

### 10.1. Màn hình Quản lý Nhân viên & Phân quyền (`Staff & Access`) — [HOÀN THÀNH]
* Đã triển khai đầy đủ giao diện, dữ liệu mẫu chuẩn (luan, Nguyen Huu Hung, linh vi...), bộ lọc vai trò & chi nhánh, cùng modal Thêm/Sửa nhân viên.

### 10.2. Danh sách lỗi giao diện trên Omnichannel Inbox (Dark Mode) — [HOÀN THÀNH 5/5 LỖI]
* **Lỗi 1 (P1 - Contrast Bug)**: Đã khắc phục triệt để tương phản bong bóng chat Dark Mode.
* **Lỗi 2 (P2 - Chip ALL)**: Đã khắc phục hiển thị chữ đen trên nền trắng active.
* **Lỗi 3 (P3 - Composer Scrollbar & Nút Mẫu)**: Đã ẩn cuộn thừa và chống méo nút.
* **Lỗi 4 (P3 - Phân biệt Shop vs Khách)**: Đã chuẩn hóa màu sắc và tag `[AI]`.
* **Lỗi 5 (P4 - Đồng bộ Sidebar)**: Đã chuẩn hóa tiếng Anh toàn bộ hệ thống menu.

### 10.3. Khắc phục lỗi hiển thị trống màn hình Staff & Operations — [HOÀN THÀNH]
* **Nguyên nhân**: Thiếu 4 thẻ đóng `</div>` ở cuối `#view-settings` trong `index.html` khiến các view section tiếp theo (`#view-stores`, `#view-inventory`, `#view-production`, `#view-suppliers`, `#view-staff`) bị lồng vào bên trong thẻ `#view-settings`. Khi router kích hoạt các view này, do thẻ cha `#view-settings` có `display: none;` nên toàn bộ vùng hiển thị bị trắng xóa.
* **Khắc phục**: Đã đóng đủ các thẻ `</div>` cho `.module-row-item`, `.modules-list`, `.panel-card`, và `#view-settings`. Tất cả các view section hiện tại đều là con trực tiếp của `.canvas-container`, chuyển tab mượt mà với 100% dữ liệu hiển thị chính xác.

---

## 11. TRIỂN KHAI TRỢ LÝ TÁC TỬ MERCURIX AI // PHASE 1 — [HOÀN THÀNH]

> **Triết lý kiến trúc**: Kế thừa chắt lọc từ tài liệu `Mercurix`: Nhận thức ngữ cảnh (`PageContext`), Vòng lặp ReAct liên hoàn (> 3 bước: Reason ➔ Act ➔ Observe ➔ Repeat), và Tôn chỉ Human-in-the-Loop ("Con người bấm nút cuối cùng").

### 11.1. Cấu trúc Giao diện Slide-out Drawer 420px (Phương án A)
* **Vị trí**: Ngăn kéo trượt cố định mép phải màn hình (rộng `420px`), mở/đóng bằng nút `[MERCURIX AI]` trên Topbar, nút tắt `Esc` hoặc phím tắt `Ctrl + Space` / `Alt + A`.
* **Zero-Icon & Monochrome**: Toàn bộ nhãn, thẻ, bước tư duy đều dùng typography sắc nét, font `Plus Jakarta Sans` và `JetBrains Mono`, không icon hình ảnh, tương thích 100% Dark/Light mode.
* **Banner Ngữ cảnh động**: Tự động hiển thị `[VIEW: ...]` và `[NODE: ...]` theo thời gian thực khi người dùng chuyển trang.
* **Dòng thẻ hội thoại ReAct**:
  * Thẻ người dùng (C1): Tin nhắn và thời gian.
  * Thẻ suy luận (C3): Khối `[REASONING // N STEPS]` có thể mở/gập.
  * Thẻ tác vụ công cụ (C5): Thẻ `[ui.navigate]` và `[ui.open_form]` hiển thị trạng thái `[SUCCESS]` hoặc `[FORM_PREFILLED]`.
  * Thẻ phản hồi trợ lý (C2): Trình bày ngắn gọn, làm nổi bật thông số và mã SKU.

### 11.2. Làm chủ Kịch bản 1: Tự động hóa Điều chuyển kho (Automated Stock Dispatch)
* **Luồng xử lý**:
  1. Người dùng yêu cầu điều chuyển (VD: *"Tạo phiếu điều chuyển 100 áo sơ mi về Đồng Khởi"* hoặc *"Chuyển 50 đầm dạ hội về Saigon Centre"*).
  2. Agent bóc tách thực thể: Điểm xuất (`Central Hub [WH-01]`), Điểm đích (`MER-VC-DK` hoặc `MER-SC`...), Mã SKU (`SKU-TOP-01-M`, `SKU-DRS-01-M`...), Số lượng.
  3. Agent kích hoạt `ui.navigate` chuyển màn hình sang `Inventory & Stock`.
  4. Agent kích hoạt `ui.open_form` mở `#dispatch-modal` và điền sẵn toàn bộ trường dữ liệu.
  5. Giữ nguyên chốt chặn an toàn: Người dùng trực tiếp kiểm tra và bấm `SUBMIT DISPATCH`.

### 11.3. Làm chủ Kịch bản 2: Truy vấn & Lọc dữ liệu thông minh (Smart Search & Filtering)
* **Luồng xử lý**:
  * **Lọc tồn kho thấp**: Câu lệnh *"Lọc tồn kho thấp"* hoặc chip `[Filter Low Stock (<= 15)]` ➔ Chuyển sang Inventory ➔ Quét danh sách tồn kho ➔ Lọc ra các SKU dưới ngưỡng ➔ Báo cáo chi tiết vị trí và số lượng tồn.
  * **Lọc nhân sự theo vai trò**: Câu lệnh *"Lọc Designer"*, *"Tìm nhân viên CSKH"*, v.v. ➔ Chuyển sang Staff & Access ➔ Tự chọn dropdown filter ➔ Liệt kê danh sách nhân sự tìm thấy.
  * **Lọc đơn hàng**: Câu lệnh *"Lọc đơn Shopee"*, *"Xem đơn đang giao"* ➔ Chuyển sang Sales & Orders ➔ Áp dụng bộ lọc kênh hoặc trạng thái.
  * **Tra cứu số liệu**: Tra cứu doanh thu, tổng số đơn, tỷ lệ an toàn kho bãi tức thì từ `mercuriosStore`.

### 11.4. Làm chủ Kịch bản 3: Chuyển đổi giao diện Sáng / Tối (Theme Switching)
* **Luồng xử lý**: Nhận diện `đổi màu nền trắng sang đen`, `dark mode`, `nền sáng`... ➔ Gọi `ui.set_theme('dark' | 'light')` ➔ Cập nhật `mercuriosStore` và `data-theme` tức thì.

### 11.5. Làm chủ Kịch bản 4: Kích hoạt nhanh biểu mẫu Thêm/Tạo (Trigger Creation)
* **Luồng xử lý**: Nhận diện `thêm collection`, `tạo sản phẩm`, `tạo đơn hàng`, `thêm khách hàng`... ➔ Chuyển đến view tương ứng ➔ Kích hoạt sự kiện click mở biểu mẫu / modal thêm mới.

### 11.6. Làm chủ Kịch bản 5: Xóa an toàn có xác nhận người dùng (Human-in-the-Loop Safe Deletion)
* **Luồng xử lý**: Tuân thủ bất biến `[INV-ASSISTANT-05]` ➔ Nhận diện lệnh xóa (VD: `xóa orders tran thanh ha`) ➔ Tra cứu bản ghi chính xác ➔ Hỏi xác nhận cụ thể kèm thông số ➔ Chỉ khi người dùng nhắn *"Xác nhận xóa"* mới gọi `ops.deleteRecord`.

### 11.7. Làm chủ Kịch bản 6: Hỏi lại thông minh theo ngữ cảnh (Contextual Clarification)
* **Luồng xử lý**: Xóa bỏ hoàn toàn câu trả lời rập khuôn 3 ví dụ ➔ Phân tích ý định và động từ người dùng vừa gõ để đặt câu hỏi làm rõ đích xác yêu cầu.


