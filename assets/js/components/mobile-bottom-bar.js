(function () {
    'use strict';
    const qs = window.LaPaz.qs;
    const qsa = window.LaPaz.qsa;
    const ready = window.LaPaz.ready;

    /* ══════════════════════════════════════════════════════════════
       5. MOBILE STICKY BOTTOM BAR
       ══════════════════════════════════════════════════════════════ */
    (function initMobileBottomBar() {
        const bar = document.createElement('div');
        bar.id = 'mobile-bottombar';
        bar.setAttribute('role', 'navigation');
        bar.setAttribute('aria-label', 'Liên hệ nhanh');
        bar.innerHTML = `
            <a href="tel:0846208028" id="mbb-letan" aria-label="Gọi lễ tân">
                <span class="mbb-icon">📞</span>
                <span class="mbb-label">Gọi lễ tân</span>
            </a>
            <a href="tel:0912680203" id="mbb-hotline" aria-label="Gọi hotline">
                <span class="mbb-icon">☎️</span>
                <span class="mbb-label">Hotline</span>
            </a>
            <a href="https://zalo.me/0912680203" id="mbb-zalo" target="_blank" rel="noopener" aria-label="Nhắn Zalo">
                <span class="mbb-icon">💬</span>
                <span class="mbb-label">Nhắn Zalo</span>
            </a>
        `;
        document.body.appendChild(bar);
    })();



})();
