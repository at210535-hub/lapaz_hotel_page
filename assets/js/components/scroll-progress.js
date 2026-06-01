(function () {
    'use strict';
    const qs = window.LaPaz.qs;
    const qsa = window.LaPaz.qsa;
    const ready = window.LaPaz.ready;

    /* ══════════════════════════════════════════════════════════════
       1. SCROLL PROGRESS BAR
       ══════════════════════════════════════════════════════════════ */
    (function initScrollProgress() {
        const bar = document.createElement('div');
        bar.id = 'scroll-progress';
        bar.innerHTML = '<div id="scroll-progress-bar"></div>';
        document.body.prepend(bar);

        const fill = bar.querySelector('#scroll-progress-bar');
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                const docH = document.documentElement.scrollHeight - window.innerHeight;
                const pct = docH > 0 ? (scrollTop / docH) * 100 : 0;
                fill.style.width = pct.toFixed(2) + '%';
                ticking = false;
            });
        }, { passive: true });
    })();



})();
