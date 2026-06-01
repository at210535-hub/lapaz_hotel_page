// ── SCROLL REVEAL (2 chiều, đa hướng) ───────────────────────────────────────
const REVEAL_SEL = '.reveal, .reveal-left, .reveal-right, .reveal-scale';

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
            el.classList.remove('hiding');
            requestAnimationFrame(() => el.classList.add('visible'));
        } else {
            if (el.classList.contains('visible')) {
                el.classList.add('hiding');
                el.classList.remove('visible');
            }
        }
    });
}, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll(REVEAL_SEL).forEach((el) => revealObserver.observe(el));


