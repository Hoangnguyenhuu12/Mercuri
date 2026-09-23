# MERCURIX // BAN AI & TỰ ĐỘNG HÓA

> **Vùng làm việc độc quyền của Ban AI & Tự động hóa**  
> *Hệ sinh thái Mercuri // Phân hệ trí tuệ nhân tạo*

---

## 1. PHẠM VI NGHIỆP VỤ
* **Demand Forecasting**: Mô hình dự báo nhu cầu hàng hóa, cảnh báo cạn kho SKU theo mùa.
* **Smart Order Routing**: Tự động hóa phân bổ và điều chuyển đơn hàng giữa các kho `[WH-01]`, `[WH-02]` và cửa hàng `[ST-01]`.
* **Telemetry & Analytics**: Thu thập và phân tích chỉ số vận hành bán lẻ đa kênh thời gian thực.

## 2. GIAO DIỆN TÍCH HỢP (MERCURIX BRIDGE)
Ban AI giao tiếp trực tiếp với giao diện vận hành **MercuriOS** thông qua đối tượng toàn cầu:
```javascript
window.Mercurios
```

### Các API chính:
* `window.Mercurios.getState()`: Trích xuất toàn bộ state hiện tại.
* `window.Mercurios.switchView(viewName)`: Điều hướng màn hình từ xa.
* `window.Mercurios.switchNode(nodeId)`: Đổi điểm vận hành đang theo dõi.
* `window.Mercurios.dispatchStock(payload)`: Kích hoạt lệnh xuất kho tức thì.
* `window.Mercurios.setMetric(category, key, value)`: Cập nhật chỉ số AI.
* `window.Mercurios.registerModule(containerSelector, renderFn)`: Nhúng widget phân tích.
* `window.Mercurios.onStateChange(callback)`: Lắng nghe sự kiện thay đổi dữ liệu thời gian thực.
