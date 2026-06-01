(function () {
    'use strict';
    const qs = window.LaPaz.qs;
    const qsa = window.LaPaz.qsa;
    const ready = window.LaPaz.ready;

    /* ══════════════════════════════════════════════════════════════
       7. MOTION UPGRADES — Ken Burns slide + counter flip
       ══════════════════════════════════════════════════════════════ */
    (function initMotionUpgrades() {
        // Ken Burns: hero slide bắt đầu ở scale(1.06), khi active về scale(1)
        // CSS đã set transition 9s; chỉ cần đảm bảo inactive slide reset về scale lớn
        // → đã xử lý qua CSS .hero-slide { transform: scale(1.06) } / .hero-slide.active { scale(1) }

        // Counter số flip animation
        function patchCounter() {
            const counterEl = qs('.hero-counter-cur');
            if (!counterEl) return;

            // Observer để bắt khi textContent đổi (goSlide cập nhật bằng .textContent)
            const mo = new MutationObserver(() => {
                counterEl.style.opacity = '0';
                counterEl.style.transform = 'translateY(-8px)';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        counterEl.style.opacity = '1';
                        counterEl.style.transform = 'translateY(0)';
                    });
                });
            });

            mo.observe(counterEl, { childList: true, characterData: true, subtree: true });
        }

        ready(patchCounter);

        // Staggered reveal delays — thêm tự động cho nhiều phần tử hơn
        ready(() => {
            qsa('.rooms-grid .room-card, .attr-grid .ac, .nearby-grid .nb-card').forEach((el, i) => {
                if (!el.classList.contains('reveal-delay-1') &&
                    !el.classList.contains('reveal-delay-2') &&
                    !el.classList.contains('reveal-delay-3')) {
                    // Đã có delay từ HTML, không ghi đè
                }
            });
        });
    })();


})();
