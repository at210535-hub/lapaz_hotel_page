// ── NAV SCROLL ──────────────────────────────────────────────────────────────
const nav = document.getElementById('nav');
let ticking = false;

window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
    });
}, { passive: true });


