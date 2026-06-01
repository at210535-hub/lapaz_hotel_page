// ── MOBILE MENU ──────────────────────────────────────────────────────────────
const burger = document.querySelector('.burger');
const mNav   = document.getElementById('mNav');

function lockScroll() {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top      = `-${scrollY}px`;
    document.body.style.left     = '0';
    document.body.style.right    = '0';
    document.body.dataset.scrollY = scrollY;
}

function unlockScroll() {
    const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.left     = '';
    document.body.style.right    = '';
    window.scrollTo(0, scrollY);
}

function toggleMenu() {
    const isOpen = mNav.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    nav.classList.toggle('menu-open', isOpen);
    isOpen ? lockScroll() : unlockScroll();
}

function closeMenu() {
    if (!mNav.classList.contains('open')) return;
    mNav.classList.remove('open');
    burger.classList.remove('open');
    nav.classList.remove('menu-open');
    unlockScroll();
}

// Đóng menu khi bấm ra ngoài
document.addEventListener('click', (e) => {
    if (
        mNav.classList.contains('open') &&
        !mNav.contains(e.target) &&
        !burger.contains(e.target)
    ) {
        closeMenu();
    }
});


