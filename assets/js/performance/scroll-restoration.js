// ── RELOAD SCROLL CORRECTION ─────────────────────────────────────────────────
// Khi reload ở giữa trang, browser restore scroll position nhưng ảnh lazy
// chưa load xong làm layout cao lên → vị trí bị hụt.
// Fix: ghi nhớ scrollY ngay khi script chạy (trước khi layout thay đổi),
// sau window "load" (ảnh đã settle) → scroll instant lại đúng chỗ.
(function fixReloadScroll() {
    // Lấy scrollY sớm nhất — thời điểm này layout chưa bị lazy images đẩy
    const savedY = window.scrollY;

    window.addEventListener('load', () => {
        const hash = window.location.hash;

        if (hash) {
            // Có hash → scroll về đúng section sau khi layout ổn định
            const target = document.querySelector(hash);
            if (!target) return;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const navH = document.getElementById('nav').getBoundingClientRect().height;
                    const y    = target.getBoundingClientRect().top + window.scrollY - navH - 8;
                    window.scrollTo({ top: y, behavior: 'instant' });
                });
            });
        } else if (savedY > 100) {
            // Không có hash, đang ở giữa trang.
            // Tại thời điểm "load", ảnh lazy đã load xong và layout đã settle.
            // window.scrollY bây giờ là vị trí browser đã restore — nhưng có thể
            // bị lệch so với savedY vì layout cao hơn sau khi ảnh load.
            // Scroll instant lại chính savedY (vị trí lúc mới mở trang) để khớp.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    window.scrollTo({ top: savedY, behavior: 'instant' });
                });
            });
        }
    });
})();


