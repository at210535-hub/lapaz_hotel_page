/* ═══════════════════════════════════════════════════════════════════
   LA PAZ HOTEL — UPGRADES.JS
   Thêm vào cuối <body>, SAU script.js:
   <script src="upgrades.js"></script>
   ═══════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ──────────────────────────────────────────────────────────────
       UTIL
       ────────────────────────────────────────────────────────────── */
    function qs(sel, root) { return (root || document).querySelector(sel); }
    function qsa(sel, root) { return [...(root || document).querySelectorAll(sel)]; }

    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }


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


    /* ══════════════════════════════════════════════════════════════
       2. ACTIVE NAV LINK (highlight section đang xem)
       ══════════════════════════════════════════════════════════════ */
    (function initActiveNav() {
        const navLinks = qsa('.nav-links a[href^="#"]');
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


    /* ══════════════════════════════════════════════════════════════
       4. FLOATING "ĐẶT PHÒNG" BUTTON
       ══════════════════════════════════════════════════════════════ */
    (function initFAB() {
        const fab = document.createElement('a');
        fab.id = 'fab-booking';
        fab.href = '#contact';
        fab.setAttribute('aria-label', 'Đặt phòng ngay');
        fab.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8"  y1="2" x2="8"  y2="6"/>
                <line x1="3"  y1="10" x2="21" y2="10"/>
            </svg>
            Đặt phòng
        `;
        document.body.appendChild(fab);

        // Hiện sau khi scroll qua hero (~100vh)
        const SHOW_THRESHOLD = window.innerHeight * 0.5;
        let fabVisible = false;
        let ticking = false;

        function updateFAB() {
            const shouldShow = window.scrollY > SHOW_THRESHOLD;
            if (shouldShow !== fabVisible) {
                fabVisible = shouldShow;
                fab.classList.toggle('fab-visible', fabVisible);
            }
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(updateFAB);
        }, { passive: true });

        updateFAB();
    })();


    /* ══════════════════════════════════════════════════════════════
       5. MOBILE STICKY BOTTOM BAR
       ══════════════════════════════════════════════════════════════ */
    (function initMobileBottomBar() {
        const bar = document.createElement('div');
        bar.id = 'mobile-bottombar';
        bar.setAttribute('role', 'navigation');
        bar.setAttribute('aria-label', 'Liên hệ nhanh');
        bar.innerHTML = `
            <a href="tel:0846208028" id="mbb-letan" aria-label="Gọi lễ tân">
                <span class="mbb-icon">📞</span>
                <span class="mbb-label">Gọi lễ tân</span>
            </a>
            <a href="tel:0912680203" id="mbb-hotline" aria-label="Gọi hotline">
                <span class="mbb-icon">☎️</span>
                <span class="mbb-label">Hotline</span>
            </a>
            <a href="https://zalo.me/0912680203" id="mbb-zalo" target="_blank" rel="noopener" aria-label="Nhắn Zalo">
                <span class="mbb-icon">💬</span>
                <span class="mbb-label">Nhắn Zalo</span>
            </a>
        `;
        document.body.appendChild(bar);
    })();


    /* ══════════════════════════════════════════════════════════════
       6. HERO SLIDE PROGRESS — tiến trình thời gian thực
          Đây là override/patch cho goSlide() đã có sẵn trong trang.
          Chờ window load xong để đảm bảo script.js chạy trước.
       ══════════════════════════════════════════════════════════════ */
    (function initSlideProgress() {
        const SLIDE_DURATION = 5000; // ms — khớp với setInterval trong script.js

        function patchSlideshow() {
            const dots = qsa('.hero-dot');
            if (!dots.length) return;

            // Set CSS variable cho animation duration
            dots.forEach(dot => {
                dot.style.setProperty('--slide-duration', (SLIDE_DURATION / 1000) + 's');
            });

            // Hàm bật animation fill cho dot active
            function activateProgress(idx) {
                dots.forEach((dot, i) => {
                    dot.classList.remove('running');
                    // Kích hoạt reflow để restart animation
                    void dot.offsetWidth;
                    if (i === idx) {
                        dot.classList.add('running');
                    }
                });
            }

            // Patch goSlide toàn cục — bọc lại để gọi kèm activateProgress
            const originalGoSlide = window.goSlide;
            if (typeof originalGoSlide === 'function') {
                window.goSlide = function (idx) {
                    originalGoSlide(idx);
                    // idx đã được normalize bên trong goSlide,
                    // ta cần tính lại current: lấy dot nào có class active
                    requestAnimationFrame(() => {
                        const activeIdx = dots.findIndex(d => d.classList.contains('active'));
                        if (activeIdx >= 0) activateProgress(activeIdx);
                    });
                };
            }

            // Khởi động lần đầu
            const firstActive = dots.findIndex(d => d.classList.contains('active'));
            activateProgress(firstActive >= 0 ? firstActive : 0);
        }

        // Đảm bảo DOM + script.js chạy xong
        if (document.readyState === 'complete') {
            patchSlideshow();
        } else {
            window.addEventListener('load', patchSlideshow, { once: true });
        }
    })();


    /* ══════════════════════════════════════════════════════════════
       7. MOTION UPGRADES — Ken Burns slide + counter flip
       ══════════════════════════════════════════════════════════════ */
    (function initMotionUpgrades() {
        // Ken Burns: hero slide bắt đầu ở scale(1.06), khi active về scale(1)
        // CSS đã set transition 9s; chỉ cần đảm bảo inactive slide reset về scale lớn
        // → đã xử lý qua CSS .hero-slide { transform: scale(1.06) } / .hero-slide.active { scale(1) }

        // Counter số flip animation
        function patchCounter() {
            const counterEl = qs('.hero-counter-cur');
            if (!counterEl) return;

            // Observer để bắt khi textContent đổi (goSlide cập nhật bằng .textContent)
            const mo = new MutationObserver(() => {
                counterEl.style.opacity = '0';
                counterEl.style.transform = 'translateY(-8px)';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        counterEl.style.opacity = '1';
                        counterEl.style.transform = 'translateY(0)';
                    });
                });
            });

            mo.observe(counterEl, { childList: true, characterData: true, subtree: true });
        }

        ready(patchCounter);

        // Staggered reveal delays — thêm tự động cho nhiều phần tử hơn
        ready(() => {
            qsa('.rooms-grid .room-card, .attr-grid .ac, .nearby-grid .nb-card').forEach((el, i) => {
                if (!el.classList.contains('reveal-delay-1') &&
                    !el.classList.contains('reveal-delay-2') &&
                    !el.classList.contains('reveal-delay-3')) {
                    // Đã có delay từ HTML, không ghi đè
                }
            });
        });
    })();

})();
