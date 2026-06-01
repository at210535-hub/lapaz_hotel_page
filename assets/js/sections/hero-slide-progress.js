(function () {
    'use strict';
    const qs = window.LaPaz.qs;
    const qsa = window.LaPaz.qsa;
    const ready = window.LaPaz.ready;

    /* ══════════════════════════════════════════════════════════════
       6. HERO SLIDE PROGRESS — tiến trình thời gian thực
          Đây là override/patch cho goSlide() đã có sẵn trong trang.
          Chờ window load xong để đảm bảo script.js chạy trước.
       ══════════════════════════════════════════════════════════════ */
    (function initSlideProgress() {
        const SLIDE_DURATION = 5000; // ms — khớp với setInterval trong script.js

        function patchSlideshow() {
            const dots = qsa('.hero-dot');
            if (!dots.length) return;

            // Set CSS variable cho animation duration
            dots.forEach(dot => {
                dot.style.setProperty('--slide-duration', (SLIDE_DURATION / 1000) + 's');
            });

            // Hàm bật animation fill cho dot active
            function activateProgress(idx) {
                dots.forEach((dot, i) => {
                    dot.classList.remove('running');
                    // Kích hoạt reflow để restart animation
                    void dot.offsetWidth;
                    if (i === idx) {
                        dot.classList.add('running');
                    }
                });
            }

            // Patch goSlide toàn cục — bọc lại để gọi kèm activateProgress
            const originalGoSlide = window.goSlide;
            if (typeof originalGoSlide === 'function') {
                window.goSlide = function (idx) {
                    originalGoSlide(idx);
                    // idx đã được normalize bên trong goSlide,
                    // ta cần tính lại current: lấy dot nào có class active
                    requestAnimationFrame(() => {
                        const activeIdx = dots.findIndex(d => d.classList.contains('active'));
                        if (activeIdx >= 0) activateProgress(activeIdx);
                    });
                };
            }

            // Khởi động lần đầu
            const firstActive = dots.findIndex(d => d.classList.contains('active'));
            activateProgress(firstActive >= 0 ? firstActive : 0);
        }

        // Đảm bảo DOM + script.js chạy xong
        if (document.readyState === 'complete') {
            patchSlideshow();
        } else {
            window.addEventListener('load', patchSlideshow, { once: true });
        }
    })();



})();
