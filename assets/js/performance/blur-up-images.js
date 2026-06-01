// ── BLUR-UP IMAGE LOADING ─────────────────────────────────────────────────────
// Mọi ảnh bắt đầu ở trạng thái mờ (img-loading).
// Khi load xong → thêm img-loaded → CSS transition fade in mượt.
// Hero images (fetchpriority=high) skip blur-up vì đã load rất nhanh.
function setupBlurUp() {
    document.querySelectorAll('img').forEach((img) => {
        // Bỏ qua hero images — đã được preload, không cần blur-up
        if (img.getAttribute('fetchpriority') === 'high') return;
        // Bỏ qua ảnh cafe-menu — opacity/visibility do CSS .cmv-active quản lý riêng,
        // thêm img-loading sẽ giữ filter:blur ngay cả khi hover đúng món
        if (img.classList.contains('cafe-menu-img-main')) return;
        // Bỏ qua ảnh đã load xong (từ cache)
        if (img.complete && img.naturalWidth > 0) return;

        img.classList.add('img-loading');

        img.addEventListener('load', () => {
            img.classList.remove('img-loading');
            img.classList.add('img-loaded');
        }, { once: true });

        img.addEventListener('error', () => {
            img.classList.remove('img-loading');
        }, { once: true });
    });
}

// Chạy ngay sau DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupBlurUp);
} else {
    setupBlurUp();
}


