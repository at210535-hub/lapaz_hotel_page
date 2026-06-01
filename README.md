# La Paz Hotel — bản đã tách module

## Cách quản lý mới

HTML chỉ cần gọi:

```html
<link rel="stylesheet" href="assets/css/main.css">
<script src="assets/js/main.js"></script>
```

`main.css` là file trung tâm import các CSS nhỏ theo chức năng.
`main.js` là file trung tâm nạp các JS nhỏ theo đúng thứ tự phụ thuộc.

## Cấu trúc chính

```txt
index.html
assets/
  css/
    main.css
    base/
    layout/
    sections/
    components/
  js/
    main.js
    core/
    layout/
    sections/
    components/
    performance/
```

## Ghi chú

- `style.css` và `upgrades.css` cũ đã được chia vào các file chức năng.
- `script.js`, `upgrades.js` và các đoạn script inline cũ đã được chia vào các file chức năng.
- Ảnh, favicon, logo giữ nguyên đường dẫn như bản gốc. Khi đưa lên web thật, đặt thư mục `assets` cạnh `index.html` và giữ nguyên các thư mục ảnh/logo hiện có.


## Cập nhật Cafe Menu
- Section `#cafe` đã được đổi sang menu chính thức.
- Ảnh menu đầy đủ nằm tại `assets/images/lapaz-cafe-menu.png`.
- CSS quản lý trong `assets/css/sections/cafe.css`.
- JS tab/caption quản lý trong `assets/js/sections/cafe-menu.js`.


## Cập nhật Cafe Menu interactive
- Section cafe không hiển thị ảnh menu nguyên bản.
- Ảnh sản phẩm được tách thành `assets/images/cafe-products/*.webp`.
- Desktop hover/click phân loại hoặc món để đổi ảnh sản phẩm bên cạnh.
- Mobile hiển thị đủ các phân loại bằng lưới tab 2-3 cột.
