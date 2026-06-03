// La Paz runtime polish: one source of truth for anchor scrolling + map recovery.
// Keep this file loaded AFTER main.js, lapaz-revolver-slider.js and rooms-mobile-slider.js.
(function initLaPazRuntimePolish() {
    'use strict';

    const SLIDE_MS = 5000;
    const MOBILE_BP = 960;
    const MENU_CLOSE_DELAY = 190;
    const SCROLL_CORRECT_DELAY = 760;
    const SCROLL_CORRECT_DELAY_2 = 1150;
    const CORRECTION_THRESHOLD = 12;

    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn, { once: true });
        } else {
            fn();
        }
    }

    ready(() => {
        document.documentElement.style.setProperty('--lapaz-slide-duration', `${SLIDE_MS / 1000}s`);
        initAnchorScroll();
        initMapRecovery();
    });

    function isMobile() {
        return window.innerWidth <= MOBILE_BP;
    }

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function getNav() {
        return document.getElementById('nav') || document.querySelector('nav');
    }

    function measureScrolledNavHeight() {
        const nav = getNav();
        if (!nav) return 0;

        const currentStyle = window.getComputedStyle(nav);
        const fixedLike = currentStyle.position === 'fixed' || currentStyle.position === 'sticky';
        if (!fixedLike) return 0;

        // If already scrolled, actual height is the right value.
        if (window.scrollY > 40 || nav.classList.contains('scrolled')) {
            return Math.ceil(nav.getBoundingClientRect().height);
        }

        // At page top the nav is taller. For any section jump, final nav will be scrolled.
        // Measure a hidden clone with .scrolled to avoid landing too low on first click.
        const clone = nav.cloneNode(true);
        clone.classList.add('scrolled');
        clone.style.position = 'fixed';
        clone.style.visibility = 'hidden';
        clone.style.pointerEvents = 'none';
        clone.style.left = '0';
        clone.style.right = '0';
        clone.style.top = '0';
        clone.style.transition = 'none';
        document.body.appendChild(clone);
        const h = Math.ceil(clone.getBoundingClientRect().height);
        clone.remove();
        return h || Math.ceil(nav.getBoundingClientRect().height);
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
        let node = section?.previousElementSibling || null;

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
            try {
                return document.querySelector(hash);
            } catch (_) {
                return null;
            }
        }
    }

    function getAnchorForTarget(target) {
        return getDividerBeforeSection(target) || target;
    }

    function computeTop(target) {
        const anchor = getAnchorForTarget(target);
        const navHeight = measureScrolledNavHeight();
        const docTop = window.scrollY + anchor.getBoundingClientRect().top;
        return Math.max(0, Math.round(docTop - navHeight));
    }

    function closeMobileMenu() {
        if (typeof window.closeMenu === 'function') {
            try { window.closeMenu(); } catch (_) { /* fallback below */ }
        }

        const nav = getNav();
        const menu = document.getElementById('mNav') || document.querySelector('.m-nav');
        const burger = document.querySelector('.burger');

        menu?.classList.remove('open', 'active', 'show', 'is-open', 'on');
        burger?.classList.remove('open', 'active', 'is-open', 'on');
        nav?.classList.remove('menu-open');

        document.body.classList.remove('menu-open', 'nav-open', 'm-nav-open', 'is-menu-open');
        document.documentElement.classList.remove('menu-open', 'nav-open', 'm-nav-open', 'is-menu-open');
    }

    function applyCafeJump(link) {
        const cafeJump = link?.dataset?.cafeJump;
        if (!cafeJump) return;

        window.setTimeout(() => {
            const tab = document.querySelector(`#cafe .cafe-menu-tab[data-cafe-tab="${cafeJump}"]`);
            tab?.click();
        }, 420);
    }

    function correctIfNeeded(target) {
        const top = computeTop(target);
        if (Math.abs(window.scrollY - top) > CORRECTION_THRESHOLD) {
            window.scrollTo({ top, behavior: 'auto' });
        }
    }

    function scrollToTarget(target, options = {}) {
        const behavior = prefersReducedMotion() ? 'auto' : (options.behavior || 'smooth');
        const top = computeTop(target);

        window.scrollTo({ top, behavior });

        // One or two light corrections after smooth scroll/layout settling.
        window.setTimeout(() => correctIfNeeded(target), SCROLL_CORRECT_DELAY);
        if (isMobile()) {
            window.setTimeout(() => correctIfNeeded(target), SCROLL_CORRECT_DELAY_2);
        }
    }

    function scrollToHash(hash, options = {}) {
        const target = getTargetFromHash(hash);
        if (!target) return false;

        const delay = options.fromMobileMenu ? MENU_CLOSE_DELAY : 0;

        window.setTimeout(() => {
            scrollToTarget(target, { behavior: options.behavior || 'smooth' });

            if (options.updateHistory && window.location.hash !== hash) {
                history.pushState(null, '', hash);
            }

            applyCafeJump(options.link);
        }, delay);

        return true;
    }

    function initAnchorScroll() {
        // Capture phase makes this handler win over old inline/default hash behavior.
        // We do NOT stop propagation so inline closeMenu() still works.
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href^="#"]');
            if (!link) return;

            const hash = link.getAttribute('href');

            if (!hash || hash === '#') {
                event.preventDefault();
                closeMobileMenu();
                window.setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
                    history.pushState(null, '', window.location.pathname + window.location.search);
                }, link.closest('.m-nav') ? MENU_CLOSE_DELAY : 0);
                return;
            }

            const target = getTargetFromHash(hash);
            if (!target) return;

            event.preventDefault();

            const fromMobileMenu = Boolean(link.closest('.m-nav'));
            if (fromMobileMenu) closeMobileMenu();

            scrollToHash(hash, {
                updateHistory: true,
                fromMobileMenu,
                link,
            });
        }, true);

        // Direct hash entry/reload: wait for load and web fonts/images that affect layout.
        if (window.location.hash) {
            window.addEventListener('load', () => {
                window.setTimeout(() => {
                    scrollToHash(window.location.hash, { updateHistory: false, behavior: 'auto' });
                    const target = getTargetFromHash(window.location.hash);
                    if (target) {
                        window.setTimeout(() => correctIfNeeded(target), 450);
                        window.setTimeout(() => correctIfNeeded(target), 950);
                    }
                }, 120);
            }, { once: true });
        }
    }

    function initMapRecovery() {
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
                } catch (_) {
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
                iframe.src = cacheBust(originalSrc);
                watch();
            }

            function startMap() {
                if (started) return;
                started = true;
                box.classList.add('is-map-loading');
                watch();
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
