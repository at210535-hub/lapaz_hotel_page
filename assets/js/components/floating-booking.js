(function () {
    'use strict';
    const qs = window.LaPaz.qs;
    const qsa = window.LaPaz.qsa;
    const ready = window.LaPaz.ready;

    /* ══════════════════════════════════════════════════════════════
       4. FLOATING "ĐẶT PHÒNG" BUTTON
       ══════════════════════════════════════════════════════════════ */
    (function initFAB() {
        const fab = document.createElement('a');
        fab.id = 'fab-booking';
        fab.href = '#contact';
        fab.setAttribute('aria-label', 'Đặt phòng ngay');
        fab.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8"  y1="2" x2="8"  y2="6"/>
                <line x1="3"  y1="10" x2="21" y2="10"/>
            </svg>
            Đặt phòng
        `;
        document.body.appendChild(fab);

        // Hiện sau khi scroll qua hero (~100vh)
        const SHOW_THRESHOLD = window.innerHeight * 0.5;
        let fabVisible = false;
        let ticking = false;

        function updateFAB() {
            const shouldShow = window.scrollY > SHOW_THRESHOLD;
            if (shouldShow !== fabVisible) {
                fabVisible = shouldShow;
                fab.classList.toggle('fab-visible', fabVisible);
            }
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(updateFAB);
        }, { passive: true });

        updateFAB();
    })();



})();
