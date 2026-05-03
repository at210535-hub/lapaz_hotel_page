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


// ── SCROLL REVEAL (2 chiều — giống Apple) ────────────────────────────────────
// Scroll xuống → visible (fade up vào)
// Scroll lên   → hiding  (fade xuống ra) → sau đó reset để reveal lại được
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
            // Vào viewport: bỏ hiding, thêm visible
            el.classList.remove('hiding');
            // Dùng rAF để browser kịp apply bỏ hiding trước khi thêm visible
            requestAnimationFrame(() => el.classList.add('visible'));
        } else {
            // Ra khỏi viewport: reset để có thể reveal lại khi scroll xuống
            if (el.classList.contains('visible')) {
                el.classList.add('hiding');
                el.classList.remove('visible');
            }
        }
    });
}, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'   // Trigger khi vào 40px trong viewport
});

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));


// ── BLUR-UP IMAGE LOADING ─────────────────────────────────────────────────────
// Mọi ảnh bắt đầu ở trạng thái mờ (img-loading).
// Khi load xong → thêm img-loaded → CSS transition fade in mượt.
// Hero images (fetchpriority=high) skip blur-up vì đã load rất nhanh.
function setupBlurUp() {
    document.querySelectorAll('img').forEach((img) => {
        // Bỏ qua hero images — đã được preload, không cần blur-up
        if (img.getAttribute('fetchpriority') === 'high') return;
        // Bỏ qua ảnh đã load xong (từ cache)
        if (img.complete && img.naturalWidth > 0) return;

        img.classList.add('img-loading');

        img.addEventListener('load', () => {
            img.classList.remove('img-loading');
            img.classList.add('img-loaded');
        }, { once: true });

        img.addEventListener('error', () => {
            img.classList.remove('img-loading');
        }, { once: true });
    });
}

// Chạy ngay sau DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupBlurUp);
} else {
    setupBlurUp();
}


// ── CAFE MENU TABS ───────────────────────────────────────────────────────────
function switchTab(btn, panelId) {
    document.querySelectorAll('.mtab').forEach((t)  => t.classList.remove('on'));
    document.querySelectorAll('.mpanel').forEach((p) => p.classList.remove('on'));
    btn.classList.add('on');
    document.getElementById(panelId).classList.add('on');
}