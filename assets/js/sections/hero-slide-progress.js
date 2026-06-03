(function () {
    'use strict';

    const SLIDE_DURATION = 5000;

    function qsa(selector) {
        return Array.from(document.querySelectorAll(selector));
    }

    function activateProgress(dots, idx) {
        dots.forEach((dot, i) => {
            dot.style.setProperty('--slide-duration', `${SLIDE_DURATION / 1000}s`);
            dot.classList.remove('running');
            void dot.offsetWidth;
            if (i === idx) dot.classList.add('running');
        });
    }

    function patchSlideshow() {
        const dots = qsa('.hero-dot');
        if (!dots.length || window.__lapazHeroProgressPatched) return;

        window.__lapazHeroProgressPatched = true;
        document.documentElement.style.setProperty('--lapaz-slide-duration', `${SLIDE_DURATION / 1000}s`);

        const originalGoSlide = window.goSlide;
        if (typeof originalGoSlide === 'function') {
            window.goSlide = function (idx) {
                originalGoSlide(idx);
                requestAnimationFrame(() => {
                    const activeIdx = dots.findIndex((dot) => dot.classList.contains('active'));
                    activateProgress(dots, activeIdx >= 0 ? activeIdx : 0);
                });
            };
        }

        const firstActive = dots.findIndex((dot) => dot.classList.contains('active'));
        activateProgress(dots, firstActive >= 0 ? firstActive : 0);
    }

    if (document.readyState === 'complete') {
        patchSlideshow();
    } else {
        window.addEventListener('load', patchSlideshow, { once: true });
    }
})();
