(function () {
    'use strict';
    const qs = window.LaPaz.qs;
    const qsa = window.LaPaz.qsa;
    const ready = window.LaPaz.ready;

    /* ══════════════════════════════════════════════════════════════
       2. ACTIVE NAV LINK (highlight section đang xem)
       ══════════════════════════════════════════════════════════════ */
    (function initActiveNav() {
        const navLinks = qsa('.nav-links a[href^="#"]').filter(a => !a.classList.contains('nav-cta'));
        const sections = navLinks
            .map(a => {
                const id = a.getAttribute('href').slice(1);
                return id ? document.getElementById(id) : null;
            })
            .filter(Boolean);

        if (!sections.length) return;

        const NAV_H = () => (qs('#nav')?.offsetHeight || 70);

        function update() {
            const scrollY = window.scrollY + NAV_H() + 20;
            let active = sections[0];

            sections.forEach(sec => {
                if (sec.offsetTop <= scrollY) active = sec;
            });

            navLinks.forEach(a => {
                const match = a.getAttribute('href') === '#' + active.id;
                a.classList.toggle('nav-active', match);
            });
        }

        window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
        update();
    })();



})();
