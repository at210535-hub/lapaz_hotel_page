// La Paz runtime polish: mobile-safe nav scroll + map recovery.
// Mục tiêu: đóng mobile menu trước, rồi scroll tới divider. Không re-align nhiều lần gây giật.
(function initLaPazRuntimePolish() {
    const SLIDE_MS = 5000;
    const MOBILE_BP = 960;

    function ready(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    ready(() => {
        document.documentElement.style.setProperty('--lapaz-slide-duration', `${SLIDE_MS / 1000}s`);
        initStableAnchorScroll();
        initSaferGoogleMapRecovery();
    });

    function isMobile() {
        return window.innerWidth <= MOBILE_BP;
    }

    function getNavHeight() {
        const nav = document.querySelector('nav');
        if (!nav) return 0;

        const style = window.getComputedStyle(nav);
        const fixedLike = style.position === 'fixed' || style.position === 'sticky';
        return fixedLike ? Math.ceil(nav.getBoundingClientRect().height) : 0;
    }

    function isSpacer(node) {
        return (
            node &&
            node.tagName === 'DIV' &&
            !node.id &&
            !node.className &&
            node.textContent.trim() === ''
        );
    }

    function getDividerBeforeSection(section) {
        let node = section.previousElementSibling;

        while (node) {
            if (node.classList?.contains('divider')) return node;
            if (!isSpacer(node)) return null;
            node = node.previousElementSibling;
        }

        return null;
    }

    function getTargetFromHash(hash) {
        if (!hash || hash === '#') return null;

        try {
            return document.querySelector(decodeURIComponent(hash));
        } catch (error) {
            return document.querySelector(hash);
        }
    }

    function closeMobileMenuNow() {
        // Nếu file mobile-menu.js expose closeMenu thì ưu tiên dùng luôn.
        if (typeof window.closeMenu === 'function') {
            try {
                window.closeMenu();
            } catch (error) {
                // fallback bên dưới
            }
        }

        const menu = document.getElementById('mNav') || document.querySelector('.m-nav');
        const burger = document.querySelector('.burger');

        if (menu) {
            menu.classList.remove('open', 'active', 'show', 'is-open', 'on');
            menu.setAttribute('aria-hidden', 'true');
        }

        if (burger) {
            burger.classList.remove('open', 'active', 'is-open', 'on');
        }

        document.body.classList.remove('menu-open', 'nav-open', 'm-nav-open', 'is-menu-open');
        document.documentElement.classList.remove('menu-open', 'nav-open', 'm-nav-open', 'is-menu-open');
    }

    function computeTop(target) {
        const divider = getDividerBeforeSection(target);
        const anchor = divider || target;
        const navHeight = getNavHeight();

        return Math.max(
            0,
            window.scrollY + anchor.getBoundingClientRect().top - navHeight
        );
    }

    function scrollToTarget(target, behavior) {
        const top = computeTop(target);
        window.scrollTo({
            top,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : behavior
        });

        // Chỉ chỉnh lại 1 lần nhẹ nếu mobile browser đổi chiều cao viewport/nav sau khi bắt đầu scroll.
        window.setTimeout(() => {
            const correctedTop = computeTop(target);
            if (Math.abs(window.scrollY - correctedTop) > 14) {
                window.scrollTo({ top: correctedTop, behavior: 'auto' });
            }
        }, isMobile() ? 520 : 260);
    }

    function scrollToHash(hash, options = {}) {
        const target = getTargetFromHash(hash);
        if (!target) return false;

        const delay = options.fromMobileMenu ? 170 : 0;

        window.setTimeout(() => {
            scrollToTarget(target, 'smooth');

            if (options.updateHistory && window.location.hash !== hash) {
                window.history.pushState(null, '', hash);
            }

            if (options.cafeJump) {
                window.setTimeout(() => {
                    const tab = document.querySelector(`#cafe .cafe-menu-tab[data-cafe-tab="${options.cafeJump}"]`);
                    if (tab) tab.click();
                }, 420);
            }
        }, delay);

        return true;
    }

    function initStableAnchorScroll() {
        // Capture để chặn smooth-scroll/hash-scroll cũ, nhưng tự đóng menu trước khi chặn.
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href^="#"]');
            if (!link) return;

            const hash = link.getAttribute('href');

            if (!hash || hash === '#') {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                closeMobileMenuNow();
                window.setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    window.history.pushState(null, '', window.location.pathname + window.location.search);
                }, isMobile() ? 120 : 0);
                return;
            }

            const target = getTargetFromHash(hash);
            if (!target) return;

            const fromMobileMenu = Boolean(link.closest('.m-nav'));
            const cafeJump = link.dataset.cafeJump;

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            if (fromMobileMenu) closeMobileMenuNow();

            scrollToHash(hash, {
                updateHistory: true,
                fromMobileMenu,
                cafeJump
            });
        }, true);

        if (window.location.hash) {
            window.setTimeout(() => {
                scrollToHash(window.location.hash, { updateHistory: false });
            }, 180);
        }
    }

    function initSaferGoogleMapRecovery() {
        document.querySelectorAll('iframe.map-iframe').forEach((iframe) => {
            const box = iframe.closest('.map-box');
            if (!box) return;

            const originalSrc = iframe.getAttribute('src');
            if (!originalSrc) return;

            const detail = box.querySelector('.map-detail');
            const mapsLink = box.querySelector('.btn-maps[href]')?.getAttribute('href') || originalSrc;

            let loaded = false;
            let attempts = 0;
            let watchTimer = null;
            let started = false;

            iframe.loading = 'eager';
            iframe.referrerPolicy = iframe.referrerPolicy || 'no-referrer-when-downgrade';

            if (detail && !detail.querySelector('.map-reload-btn')) {
                const reloadBtn = document.createElement('button');
                reloadBtn.type = 'button';
                reloadBtn.className = 'map-reload-btn';
                reloadBtn.textContent = 'Tải lại bản đồ';
                reloadBtn.addEventListener('click', () => reloadMap(true));
                detail.appendChild(reloadBtn);
            }

            if (!box.querySelector('.map-fallback-link')) {
                const fallback = document.createElement('a');
                fallback.className = 'map-fallback-link';
                fallback.href = mapsLink;
                fallback.target = '_blank';
                fallback.rel = 'noopener';
                fallback.textContent = 'Mở Google Maps ↗';
                box.appendChild(fallback);
            }

            iframe.addEventListener('load', () => {
                loaded = true;
                clearTimeout(watchTimer);
                box.classList.remove('is-map-loading', 'is-map-failed');
                box.classList.add('is-map-loaded');
            });

            iframe.addEventListener('error', () => {
                loaded = false;
                retryOrFail();
            });

            function cacheBust(src) {
                try {
                    const url = new URL(src, window.location.href);
                    url.searchParams.set('lapaz_reload', String(Date.now()));
                    return url.toString();
                } catch (error) {
                    return `${src}${src.includes('?') ? '&' : '?'}lapaz_reload=${Date.now()}`;
                }
            }

            function watch() {
                clearTimeout(watchTimer);
                watchTimer = setTimeout(() => {
                    if (!loaded) retryOrFail();
                }, 7000);
            }

            function retryOrFail() {
                if (attempts >= 2) {
                    box.classList.remove('is-map-loading');
                    box.classList.add('is-map-failed');
                    return;
                }

                reloadMap(false);
            }

            function reloadMap(force) {
                attempts = force ? 0 : attempts + 1;
                loaded = false;

                box.classList.add('is-map-loading');
                box.classList.remove('is-map-loaded', 'is-map-failed');

                // Không xóa src ngay lập tức quá nhiều lần; mobile dễ bị nháy trắng.
                iframe.src = cacheBust(originalSrc);
                watch();
            }

            function startMap() {
                if (started) return;
                started = true;

                box.classList.add('is-map-loading');
                watch();

                // Nếu iframe bị trình duyệt giữ ở trạng thái blank, reload nhẹ 1 lần khi gần viewport.
                setTimeout(() => {
                    if (!loaded) reloadMap(false);
                }, 1800);
            }

            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    if (entries.some((entry) => entry.isIntersecting)) {
                        startMap();
                        observer.disconnect();
                    }
                }, { rootMargin: '360px 0px' });

                observer.observe(box);
            } else {
                startMap();
            }
        });
    }
})();
