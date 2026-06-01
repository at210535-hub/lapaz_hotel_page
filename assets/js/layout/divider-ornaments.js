(function () {
    'use strict';
    const qs = window.LaPaz.qs;
    const qsa = window.LaPaz.qsa;
    const ready = window.LaPaz.ready;

    /* ══════════════════════════════════════════════════════════════
       3. DIVIDER ORNAMENT
       ══════════════════════════════════════════════════════════════ */
    (function initDividers() {
        const ornamentSVG = `<svg viewBox="0 0 44 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <!-- Nhánh trái -->
            <line x1="2"  y1="8" x2="14" y2="8" stroke="currentColor" stroke-width="0.8" stroke-linecap="round"/>
            <!-- Kim cương giữa -->
            <path d="M22 4 L26 8 L22 12 L18 8 Z" stroke="currentColor" stroke-width="0.9" fill="none"/>
            <!-- Chấm trong kim cương -->
            <circle cx="22" cy="8" r="1.2" fill="currentColor" opacity="0.7"/>
            <!-- Nhánh phải -->
            <line x1="30" y1="8" x2="42" y2="8" stroke="currentColor" stroke-width="0.8" stroke-linecap="round"/>
            <!-- Chấm nhỏ hai bên -->
            <circle cx="14" cy="8" r="1.2" fill="none" stroke="currentColor" stroke-width="0.7"/>
            <circle cx="30" cy="8" r="1.2" fill="none" stroke="currentColor" stroke-width="0.7"/>
        </svg>`;

        qsa('.divider').forEach(div => {
            // Chỉ inject nếu chưa có ornament
            if (div.querySelector('.divider-ornament')) return;
            const ornament = document.createElement('span');
            ornament.className = 'divider-ornament';
            ornament.innerHTML = ornamentSVG;
            div.appendChild(ornament);
        });
    })();



})();
