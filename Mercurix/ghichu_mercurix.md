# MERCURIX // TỔNG HỢP KIẾN TRÚC, BỘ NÃO VÀ QUY CHUẨN TÁC TỬ AI

> **Tài liệu bàn giao & Quy chuẩn kỹ thuật độc quyền cho Bộ não Tác tử AI (Mercurix AI Autonomous Suite)**  
> *Thời gian cập nhật: 24/09/2026*  
> *Phụ trách: Mercurix Core AI Engineering Team*

---

## 1. TỔNG QUAN BỘ NÃO MERCURIX (AI OPERATIONS COPILOT)

* **Mercurix** là phân hệ trí tuệ nhân tạo chuyên trách tác vụ vận hành (Dedicated Task AI Assistant) cho chuỗi bán lẻ thời trang, kho hàng đa kênh và quản trị sản xuất xưởng may trong hệ sinh thái Mercuri.
* **Tầm nhìn & Định vị**:
  * Đóng vai trò như một **Thư ký vận hành số (Digital Operations Secretary)**: nắm rõ nhân viên đang đứng ở màn hình nào, tự động hóa các chuỗi tác vụ phức tạp (chuẩn bị đơn điều chuyển kho, lọc số liệu tồn kho báo động, tìm kiếm nhân sự, hỗ trợ trả lời khách hàng).
  * **Con người bấm nút cuối cùng (Human-in-the-Loop)**: Mọi thao tác thay đổi dữ liệu (tạo phiếu xuất kho, xóa bản ghi, duyệt đơn) chỉ được điền sẵn (pre-fill) để nhân viên chủ động bấm xác nhận.

---

## 2. QUY ĐỊNH PHÂN CHIA THƯ MỤC & RANH GIỚI KIẾN TRÚC

```
f:/Mercuri/
├── Mercurix/    --> [BỘ NÃO AI & TÁC TỬ] Toàn bộ suy nghĩ, suy luận ReAct, bóc tách thực thể & bộ công cụ
│   ├── docs/    --> Hồ sơ nghiên cứu, RFC, ADRs và đặc tả kỹ thuật chi tiết
│   └── src/     --> Mã nguồn thực thi bộ não AI (Context Engine, Action Catalog, Brain Core)
└── Mercurios/   --> [GIAO DIỆN & HỆ THỐNG] Vỏ Drawer 420px (UI Harness), CSS, View Tables, State & Server
```

### Ranh giới trách nhiệm tuyệt đối:
* **`Mercurix` sở hữu**:
  * Toàn bộ thuật toán suy luận ngôn ngữ, nhận thức ngữ cảnh (`PageContext`).
  * Danh mục công cụ hành động (`Action Catalog`) và chốt chặn an toàn (`Action Gate`).
  * Vòng lặp liên hoàn ReAct đa bước (Reason ➔ Act ➔ Observe ➔ Repeat).
  * Giao tiếp với bên ngoài qua đối tượng duy nhất: `window.Mercurix`.
* **`Mercurios` sở hữu**:
  * Giao diện người dùng (Drawer 420px, bong bóng chat, nút bấm, CSS).
  * Cơ sở dữ liệu và trạng thái ứng dụng (`mercuriosStore`).
  * Drawer UI chỉ đóng vai trò **Pure Presentation Harness**: nhận tin nhắn người dùng ➔ gọi `window.Mercurix.processCommand(text)` ➔ vẽ kết quả trả về lên màn hình.

---

## 3. CẤU TRÚC THƯ MỤC MERCURIX

```
f:/Mercuri/Mercurix/
├── docs/                                  --> Tài liệu thiết kế & đặc tả chuyên sâu
│   ├── 01-research.md                     --> Khảo sát kỹ thuật: ReAct, Dynamic Tool Calling, Context
│   ├── 02-rfc.md                          --> Đề xuất thiết kế giao thức điều phối & Human-in-the-Loop
│   ├── 03-decisions.md                    --> 17 quyết định kiến trúc cốt lõi (ADRs)
│   ├── 04-plan.md                         --> Kế hoạch phân kỳ phát triển
│   ├── 05-spec.md                         --> Đặc tả thi công: PageContext phẳng, SSE, Client Actions
│   ├── 06-verification.md                 --> Ma trận kiểm thử & bẫy lỗi
│   ├── README.md                          --> Hướng dẫn vận hành tổng quan
│   ├── index.md                           --> Chỉ mục đặc tả
│   └── modules/                           --> Hợp đồng plugin & sổ thẻ hội thoại C1–C16
├── src/                                   --> Mã nguồn thực thi độc lập của AI
│   ├── context-engine.js                  --> Nhận thức ngữ cảnh (PageContext & Contextual Chips)
│   ├── action-catalog.js                  --> Sổ đăng ký công cụ & Chốt chặn lúc thực thi (Action Gate)
│   ├── brain-core.js                      --> Bộ não ReAct Loop: bóc tách intent, parameters & điều phối
│   └── index.js                           --> Điểm vào chính xuất ra window.Mercurix
└── ghichu_mercurix.md                     --> Tài liệu tóm tắt ngữ cảnh cho Agent (File hiện tại)
```

---

## 4. BỐN TRỤ CỘT KỸ THUẬT CỐT LÕI

| Trụ cột | Nguyên lý từ tài liệu `Mercurix/docs` | Triển khai thực tế tại `Mercurix/src` |
| :--- | :--- | :--- |
| **1. Nhận thức ngữ cảnh** | `PageContext` phẳng (`route`, `module`, `entityId`). Không quét DOM thụ động. | `context-engine.js`: Theo dõi `window.mercuriosStore`, tự động đọc view hiện tại (`overview`, `inventory`, `staff`...) và đề xuất chip hành động phù hợp. |
| **2. Chốt chặn hành động** | Whitelist Tool-by-Design & Fail-Closed. Model không chạy code trực tiếp. | `action-catalog.js`: Mọi hành động đều qua `ui.navigate`, `ui.open_form`, `ops.filter_table`. Route không có trong danh mục sẽ bị từ chối an toàn. |
| **3. Vòng lặp ReAct liên hoàn** | Chu trình ReAct: Reason ➔ Act ➔ Observe ➔ Repeat (> 3 bước). | `brain-core.js`: Xâu chuỗi mượt mà: Bóc tách thực thể ➔ Chuyển trang ➔ Mở modal điền sẵn ➔ Tổng kết và yêu cầu xác nhận. |
| **4. Kiểm soát an toàn (HITL)** | Tôn chỉ: "Con người bấm nút cuối cùng". Thao tác đột biến bắt buộc duyệt. | Không tự ý submit form; mọi lệnh tạo phiếu điều chuyển đều mở modal để nhân viên kiểm tra số liệu rồi bấm `SUBMIT DISPATCH`. |

---

## 5. DANH MỤC CÔNG CỤ (ACTION CATALOG) — WHITELIST & FAIL-CLOSED

1. **`ui.navigate(targetView)`**:
   - Chuyển đổi màn hình làm việc an toàn giữa 14 phân hệ: `overview`, `products`, `categories`, `collections`, `materials`, `orders`, `customers`, `inbox`, `stores`, `inventory`, `production`, `suppliers`, `staff`, `settings`. Chặn đứng mọi route lạ không có trong danh mục (`[INV-ASSISTANT-02]`).
2. **`ui.open_form(formType, prefillData)`**:
   - `dispatch`: Mở và điền sẵn phiếu điều chuyển kho (Kho xuất, Kho nhận, SKU, Số lượng, Đánh dấu gấp).
   - `staff`: Mở form thêm mới nhân sự.
3. **`ops.filter_table(view, query)`**:
   - Tự động điền ô tìm kiếm trên bảng của view tương ứng để cô lập dữ liệu cần quan sát.
4. **`ops.filter_dropdown(selectId, value)`**:
   - Tự động chọn giá trị trong các bộ lọc Dropdown (Role nhân sự, Kênh bán hàng, Loại cửa hàng) và kích hoạt sự kiện `change`.
5. **`ops.query_data(selector)`**:
   - Truy vấn an toàn trạng thái thời gian thực từ `mercuriosStore` (tồn kho, tài chính, đơn hàng).
6. **`ui.set_theme(theme)`**:
   - Thay đổi chế độ hiển thị hệ thống (`'dark'` hoặc `'light'`) trực tiếp vào `mercuriosStore` và `data-theme`.
7. **`ui.trigger_action(elementId)`**:
   - Kích hoạt an toàn các nút bấm hành động tạo mới nghiệp vụ (`btn-add-collection`, `btn-open-add-product`, `btn-new-order`, `btn-add-customer`, `btn-add-category`, `btn-add-material`).
8. **`ops.delete_record(entityType, id)`**:
   - Thực thi xóa bản ghi đã được người dùng xác nhận rõ ràng (`order`, `product`, `customer`, `collection`).

---

## 6. ĐẶC TẢ CÁC KỊCH BẢN ĐÃ LÀM CHỦ

### 6.1. Kịch bản 1: Tự động hóa Điều chuyển kho (Automated Stock Dispatch)
* **Ý định**: `[CREATE_STOCK_DISPATCH_ORDER]`
* **Từ khóa nhận diện**: `điều chuyển`, `chuyển hàng`, `cấp hàng`, `xuất kho`, `dispatch`, `transfer`, `phiếu kho`.
* **Bóc tách thực thể**:
  * Điểm nhận: `Đồng Khởi` ➔ `MER-VC-DK`, `Saigon Centre` ➔ `MER-SC`, `Crescent Mall` ➔ `MER-CRES`, `AEON Tân Phú` ➔ `MER-AEON`, `Bà Triệu` ➔ `MER-VC-BT`, `Lotte` ➔ `MER-LOTTE`.
  * Mã SKU: `áo sơ mi` / `blouse` / `cocoon` ➔ `SKU-TOP-01-M`, `đầm` / `dạ hội` ➔ `SKU-DRS-01-M`, `quần` / `chino` ➔ `SKU-PNT-01-M`, `váy` ➔ `SKU-SKT-01-S`, `áo thun` ➔ `HE-13187`.
  * Số lượng: Tự động trích xuất số nguyên trong câu lệnh (mặc định 100).
* **Chuỗi tác vụ ReAct**:
  1. `Reason`: Xác minh tồn kho sẵn có tại Kho tổng `Central Hub [WH-01]`.
  2. `Act`: Gọi `ui.navigate('inventory')` chuyển sang màn hình tồn kho.
  3. `Act`: Gọi `ui.open_form('dispatch', {...})` mở modal và điền sẵn các trường.
  4. `Observe & Report`: Xuất thẻ `[ui.navigate]` và `[ui.open_form]`, tóm tắt thông số và nhắc người dùng bấm `SUBMIT DISPATCH`.

### 6.2. Kịch bản 2A: Lọc tồn kho thấp (Low Stock Alert)
* **Ý định**: `[QUERY_AND_FILTER_LOW_STOCK]`
* **Từ khóa nhận diện**: `tồn kho thấp`, `sắp hết`, `hết hàng`, `low stock`, `tồn thấp`.
* **Chuỗi tác vụ ReAct**:
  1. `Act`: Chuyển sang view `inventory`.
  2. `Reason`: Quét mảng `inventory` trong kho, tìm các SKU có `onHand <= 15`.
  3. `Act`: Áp dụng bộ lọc bảng `ops.filter_table('inventory', 'DRS')` hoặc dropdown `LOW_STOCK`.
  4. `Report`: Liệt kê danh sách các SKU báo động và gợi ý tạo lệnh điều chuyển.

### 6.3. Kịch bản 2B: Lọc nhân sự theo vai trò (Staff Role Search)
* **Ý định**: `[FILTER_STAFF_ROLE]`
* **Từ khóa nhận diện**: `designer`, `thiết kế`, `store manager`, `quản lý`, `cskh`, `customer care`.
* **Chuỗi tác vụ ReAct**:
  1. `Act`: Chuyển sang view `staff`.
  2. `Act`: Gọi `ops.filter_dropdown('staff-filter-role', roleTarget)` kích hoạt render lại bảng.
  3. `Report`: Báo cáo số lượng và danh sách chi tiết nhân viên tìm thấy.

### 6.4. Kịch bản 2C: Lọc đơn hàng đa kênh (Orders Filter)
* **Ý định**: `[FILTER_ORDERS]`
* **Từ khóa nhận diện**: `shopee`, `tiktok`, `website`, `đơn hàng`, `delivering`, `đang giao`.
* **Chuỗi tác vụ ReAct**:
  1. `Act`: Chuyển sang view `orders`.
  2. `Act`: Gọi `ops.filter_dropdown('order-filter-channel', channelTarget)`.
  3. `Report`: Tóm tắt số lượng đơn hàng và giá trị giao dịch gần nhất.

### 6.5. Kịch bản 3: Chuyển đổi giao diện Sáng / Tối (Theme Switching)
* **Ý định**: `[SWITCH_UI_THEME]`
* **Từ khóa nhận diện**: `đổi màu nền trắng sang đen`, `màu nền đen`, `nền tối`, `dark mode`, `nền sáng`, `light mode`.
* **Chuỗi tác vụ ReAct**:
  1. `Act`: Gọi `ui.set_theme('dark')` hoặc `ui.set_theme('light')`.
  2. `Report`: Xác nhận giao diện đã chuyển sang chế độ hiển thị yêu cầu.

### 6.6. Kịch bản 4: Kích hoạt nhanh biểu mẫu Thêm/Tạo (Trigger Creation)
* **Ý định**: `[TRIGGER_CREATE_ACTION]`
* **Từ khóa nhận diện**: `thêm collection`, `tạo bộ sưu tập`, `thêm sản phẩm`, `tạo đơn hàng`, `thêm khách hàng`.
* **Chuỗi tác vụ ReAct**:
  1. `Act`: Gọi `ui.navigate(...)` chuyển đến màn hình mục tiêu.
  2. `Act`: Gọi `ui.trigger_action(...)` kích hoạt biểu mẫu/modal thêm mới.
  3. `Report`: Thông báo đã mở sẵn tính năng thêm mới cho nhân viên thao tác.

### 6.7. Kịch bản 5: Xóa an toàn có xác nhận người dùng (Human-in-the-Loop Safe Deletion)
* **Ý định**: `[SAFE_DELETE_WITH_CONFIRMATION]`
* **Tuân thủ**: Bất biến `[INV-ASSISTANT-05]` (Kiểm soát đột biến dữ liệu).
* **Từ khóa nhận diện**: `xóa orders ...`, `xóa đơn hàng ...`, `xóa sản phẩm ...`, `xóa collection ...`.
* **Chuỗi tác vụ ReAct**:
  1. `Reason & Match`: Đối soát cơ sở dữ liệu (tên khách hàng, mã đơn, mã SKU) để định danh chính xác bản ghi mục tiêu.
  2. `Act`: Chuyển màn hình về phân hệ chứa bản ghi, lưu trạng thái `pendingConfirmation` trong bộ nhớ ngắn hạn.
  3. `Ask Confirmation`: Cảnh báo và hỏi chi tiết: *"Bạn có chắc chắn muốn xóa [Tên/Mã bản ghi] (Chi tiết thông số)? Hãy nhắn 'Xác nhận xóa' để tiến hành, hoặc 'Hủy' để bỏ qua."*
  4. `Execute on Approval`: Chỉ khi nhận được xác nhận (`xác nhận`, `đồng ý`, `ok`), mới gọi `ops.deleteRecord(...)` và báo cáo hoàn tất; nếu nhận `hủy`, hủy bỏ thao tác an toàn.

### 6.8. Kịch bản 6: Hỏi lại thông minh theo ngữ cảnh (Contextual Clarification)
* **Mục tiêu**: Tuyệt đối xóa bỏ phản hồi rập khuôn cố định.
* **Cơ chế**: Khi câu lệnh thiếu dữ kiện hoặc chưa rõ ràng, phân tích hành vi của người dùng (muốn xóa gì, muốn thêm gì, muốn tìm gì, muốn sửa gì) để hỏi lại đúng vấn đề, giúp đối thoại tự nhiên và chính xác.

---

## 7. GIAO DIỆN LẬP TRÌNH CÔNG KHAI (`window.Mercurix`)

Đối tượng toàn cục được nạp vào trình duyệt để phía giao diện MercuriOS kết nối:

```javascript
window.Mercurix = {
  version: '2.0.0-alpha',
  status: 'ACTIVE',

  // Hàm xử lý chính: nhận câu lệnh và trả về suy luận ReAct
  processCommand: async function (promptText, optionalContext) {
    // Trả về: { thinking: string[], actions: Object[], text: string }
  },

  // Hàm gợi ý chip thao tác nhanh theo màn hình
  getContextChips: function (currentView) {
    // Trả về mảng string các câu lệnh gợi ý
  },

  // Danh mục công cụ thực thi
  tools: window.MercurixActionCatalog
};
```

---

## 8. LỘ TRÌNH PHÁT TRIỂN TIẾP THEO (ROADMAP)

1. **Giai đoạn 2 (LLM API Backend & Streaming ReAct)**:
   - Kết nối Endpoint LLM thực tế (Gemini API / OpenAI / vLLM local qua luồng SSE).
   - Tích hợp bộ tách khung SSE W3C đã đặc tả tại `docs/05-spec.md` (§5.3).
2. **Giai đoạn 3 (Omnichannel CSKH Copilot)**:
   - Trợ lý thông minh hỗ trợ trả lời tin nhắn đa kênh (Shopee, TikTok, Fanpage) trong phân hệ `Omnichannel Inbox`.
   - Dự báo nhu cầu nhập vải và cảnh báo đứt gãy chuỗi cung ứng sản xuất MES.
