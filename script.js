// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── MOBILE MENU ──
const burger = document.querySelector('.burger');
const mNav   = document.getElementById('mNav');

function toggleMenu() {
    const isOpen = mNav.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    nav.classList.toggle('menu-open', isOpen);
    if (isOpen) {
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.dataset.scrollY = scrollY;
    } else {
        const scrollY = parseInt(document.body.dataset.scrollY || '0');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        window.scrollTo(0, scrollY);
    }
}

function closeMenu() {
    if (!mNav.classList.contains('open')) return;
    mNav.classList.remove('open');
    burger.classList.remove('open');
    nav.classList.remove('menu-open');
    const scrollY = parseInt(document.body.dataset.scrollY || '0');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    window.scrollTo(0, scrollY);
}

// Đóng menu khi bấm ra ngoài
document.addEventListener('click', (e) => {
    if (mNav.classList.contains('open') &&
        !mNav.contains(e.target) &&
        !burger.contains(e.target)) {
        closeMenu();
    }
});

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── CAFE MENU TABS ──
function switchTab(btn, panelId) {
    document.querySelectorAll('.mtab').forEach(t => t.classList.remove('on'));
    document.querySelectorAll('.mpanel').forEach(p => p.classList.remove('on'));
    btn.classList.add('on');
    document.getElementById(panelId).classList.add('on');
}