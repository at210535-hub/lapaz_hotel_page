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


// ── BLUR-UP IMAGE LOADING ─────────────────────────────────────────────────────
// Mọi ảnh bắt đầu ở trạng thái mờ (img-loading).
// Khi load xong → thêm img-loaded → CSS transition fade in mượt.
// Hero images (fetchpriority=high) skip blur-up vì đã load rất nhanh.
function setupBlurUp() {
    document.querySelectorAll('img').forEach((img) => {
        // Bỏ qua hero images — đã được preload, không cần blur-up
        if (img.getAttribute('fetchpriority') === 'high') return;
        // Bỏ qua ảnh cafe-menu — opacity/visibility do CSS .cmv-active quản lý riêng,
        // thêm img-loading sẽ giữ filter:blur ngay cả khi hover đúng món
        if (img.classList.contains('cafe-menu-img-main')) return;
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
    // Reset ảnh về mặc định khi chuyển tab
    document.querySelectorAll('.cafe-menu-img-main').forEach((img) => img.classList.remove('cmv-active'));
    const def = document.querySelector('.cmv-default');
    if (def) def.classList.add('cmv-active');
}


// ── CAFE MENU — HOVER ĐỔI ẢNH (chỉ desktop ≥960px) ─────────────────────────
(function setupDrinkHover() {
    const MQ = window.matchMedia('(min-width: 960px)');
    let leaveTimer = null;

    // Fetch trước tất cả ảnh cafe-menu ngay khi section vào gần viewport.
    // Ảnh loading="lazy" chỉ được fetch khi đúng viewport — nếu không preload,
    // hover lần đầu sẽ không thấy gì vì ảnh chưa tải xong.
    (function preload() {
        const section = document.querySelector('.cafe-menu-section');
        if (!section) return;
        const io = new IntersectionObserver((entries) => {
            if (!entries[0].isIntersecting) return;
            io.disconnect();
            document.querySelectorAll('.cafe-menu-img-main').forEach((img) => {
                img.removeAttribute('loading');
                if (!img.complete || img.naturalWidth === 0) {
                    const s = img.src; img.src = ''; img.src = s;
                }
            });
        }, { rootMargin: '300px' });
        io.observe(section);
    })();

    function activate(drinkKey) {
        document.querySelectorAll('.cafe-menu-img-main').forEach((img) => img.classList.remove('cmv-active'));
        if (drinkKey) {
            const target = document.querySelector(`.cmv-item[data-drink="${drinkKey}"]`);
            if (target) { target.classList.add('cmv-active'); return; }
        }
        const def = document.querySelector('.cmv-default');
        if (def) def.classList.add('cmv-active');
    }

    function bind() {
        document.querySelectorAll('.mi[data-drink]').forEach((mi) => {
            mi.addEventListener('mouseenter', () => {
                if (!MQ.matches) return;
                clearTimeout(leaveTimer);
                activate(mi.dataset.drink);
            });
            mi.addEventListener('mouseleave', () => {
                if (!MQ.matches) return;
                clearTimeout(leaveTimer);
                leaveTimer = setTimeout(() => activate(null), 80);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
})();


// ── RELOAD SCROLL CORRECTION ─────────────────────────────────────────────────
// Khi reload ở giữa trang, browser restore scroll position nhưng ảnh lazy
// chưa load xong làm layout cao lên → vị trí bị hụt.
// Fix: ghi nhớ scrollY ngay khi script chạy (trước khi layout thay đổi),
// sau window "load" (ảnh đã settle) → scroll instant lại đúng chỗ.
(function fixReloadScroll() {
    // Lấy scrollY sớm nhất — thời điểm này layout chưa bị lazy images đẩy
    const savedY = window.scrollY;

    window.addEventListener('load', () => {
        const hash = window.location.hash;

        if (hash) {
            // Có hash → scroll về đúng section sau khi layout ổn định
            const target = document.querySelector(hash);
            if (!target) return;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const navH = document.getElementById('nav').getBoundingClientRect().height;
                    const y    = target.getBoundingClientRect().top + window.scrollY - navH - 8;
                    window.scrollTo({ top: y, behavior: 'instant' });
                });
            });
        } else if (savedY > 100) {
            // Không có hash, đang ở giữa trang.
            // Tại thời điểm "load", ảnh lazy đã load xong và layout đã settle.
            // window.scrollY bây giờ là vị trí browser đã restore — nhưng có thể
            // bị lệch so với savedY vì layout cao hơn sau khi ảnh load.
            // Scroll instant lại chính savedY (vị trí lúc mới mở trang) để khớp.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    window.scrollTo({ top: savedY, behavior: 'instant' });
                });
            });
        }
    });
})();


// ── SMOOTH SCROLL — chống hụt do ảnh lazy chưa load ─────────────────────────
(function setupScroll() {
    function getScrollTop(target) {
        const navH = nav.getBoundingClientRect().height;
        return target.getBoundingClientRect().top + window.scrollY - navH - 8;
    }

    function scrollTo(target, behavior) {
        window.scrollTo({ top: getScrollTop(target), behavior });
    }

    document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;

        const id = a.getAttribute('href').slice(1);
        if (!id) return;

        const target = document.getElementById(id);
        if (!target) return;

        e.preventDefault();

        const wasOpen = mNav.classList.contains('open');
        if (wasOpen) closeMenu();

        // Delay cho menu đóng xong, sau đó scroll
        setTimeout(() => {
            // Scroll smooth lần 1
            scrollTo(target, 'smooth');

            // Sau khi scroll smooth xong (~600ms), check lại vị trí
            // để bù trường hợp ảnh lazy load làm dịch layout
            setTimeout(() => {
                const diff = Math.abs(getScrollTop(target) - window.scrollY);
                // Nếu lệch hơn 5px thì scroll lại tức thì
                if (diff > 5) scrollTo(target, 'instant');
            }, 700);
        }, wasOpen ? 360 : 0);
    });
})();