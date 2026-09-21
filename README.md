# Cameramienbac — website tĩnh (HTML / CSS / JS)

Clone tĩnh của thiết kế `assets/design/trang-chu.png`. Trang chủ `index.html` được dựng
làm mẫu; header và footer tách thành partial để các trang sau dùng lại.

## Chạy dự án

Trang dùng `fetch()` để nạp partial nên cần chạy qua HTTP (mở trực tiếp bằng `file://`
trình duyệt sẽ chặn vì CORS):

```bash
cd cameramienbac
python3 -m http.server 8000
# mở http://localhost:8000/index.html
```

## Cấu trúc

```
index.html                    Trang chủ
giai-phap.html                Giải pháp (trang tổng)
toa-nha-thong-minh.html       Giải pháp › Tòa nhà thông minh
truong-hoc-ai.html            Giải pháp › Trường học AI
giai-phap-toan-dien.html      Giải pháp › Giải pháp toàn diện
san-pham.html                 Sản phẩm
du-an.html                    Dự án (có bộ lọc + 9 dự án mẫu)
ve-chung-toi.html             Về chúng tôi
tin-tuc.html                  Tin tức
lien-he.html                  Liên hệ (thông tin + bản đồ + form)
partials/header.html          Header dùng chung (logo, menu, hotline)
partials/footer.html          Footer dùng chung (logo, liên hệ, MXH, CTA)
assets/css/style.css          Toàn bộ style
assets/js/main.js             Nạp partial + menu mobile + active menu
assets/images/                Ảnh đã tách từ file thiết kế
assets/design/                File thiết kế gốc (tham chiếu)
```

### Thêm trang mới

```html
<div data-include="partials/header.html"></div>
<main> ... </main>
<div data-include="partials/footer.html"></div>
<script src="assets/js/main.js"></script>
```

`main.js` tự thay placeholder bằng nội dung partial và tự gắn class `is-active` cho
menu trùng tên file đang mở.

## Quy ước dựng layout

- **Khung tham chiếu: viewport 1024px** — ở độ rộng này trang khớp gần như tuyệt đối với
  `trang-chu.png` (sai lệch pixel trung bình ~4%, phần còn lại chủ yếu do file thiết kế
  là ảnh raster bị nhoè).
- `.container`: `max-width: 1200px; padding: 0 28px` → tại 1024px nội dung rộng đúng 968px
  như thiết kế.
- Font: **Barlow** (Google Fonts) — đã đo và đối chiếu tỉ lệ bề rộng / chiều cao chữ hoa
  trên 7 chuỗi khác nhau của thiết kế; Barlow là font khớp nhất trong các font có hỗ trợ
  tiếng Việt.
- Ảnh trong `assets/images/` được cắt trực tiếp từ file thiết kế. Các nền có chữ in sẵn
  (hero, dải "Vì sao chọn", header, footer, panel "Giải pháp toàn diện") đã được xoá chữ
  bằng thuật toán inpaint để dùng lại làm background sạch.

## Mức độ bám thiết kế theo trang

| Trang | Mức độ |
|-------|--------|
| `index.html` | Khớp pixel với `trang-chu.png` (xem phần dưới) |
| 6 trang có file thiết kế | Bám **bố cục, nội dung và icon** theo ảnh thiết kế; kích thước/khoảng cách dùng lại design system của trang chủ thay vì đo từng pixel |
| `ve-chung-toi.html`, `tin-tuc.html` | Không có file thiết kế — tự dựng bằng đúng design system (token màu, font, component) |

**Đã gỡ khỏi bản clone:**
- Section *"Giải pháp toàn diện từ Cameramienbac"* trên trang chủ (nội dung nay ở `giai-phap-toan-dien.html`).
- Dải CTA cuối trang (logo lớn + nút liên hệ) ở các trang trong — trùng chức năng với footer
  dùng chung nên bỏ để tránh lặp.

Header/footer của mọi trang dùng chung một partial, nên thương hiệu thống nhất là
**AI & SMART / 0979 406 868**, không theo biến thể *AI & FPT / 0973 406 668* xuất hiện trong
vài file thiết kế.

## Khác biệt có chủ đích so với ảnh thiết kế

Trong `trang-chu.png`, dải màu xanh đậm chứa logo / hotline / email / mạng xã hội nằm ở
**giữa trang** (phía dưới nó vẫn còn 2 section). Đây là footer bị đặt sai vị trí trong
ảnh mock, nên bản clone đưa footer xuống cuối trang:

```
Header → Hero → Anh đang giải quyết bài toán nào? → Vì sao chọn Cameramienbac?
       → Giải pháp toàn diện → Đối tác tin cậy → Footer
```

## Responsive

| Độ rộng   | Bố cục                                                        |
|-----------|---------------------------------------------------------------|
| ≥ 1024px  | Đúng như thiết kế (5 card / hàng, 4 cột "Vì sao chọn", footer 3 cột) |
| 720–1023  | Menu thu gọn (hamburger), 3 card / hàng, 2 cột "Vì sao chọn"   |
| < 720px   | 1 card / hàng, hotline chỉ còn icon, footer xếp dọc            |
