// La Paz runtime polish: shared timing, divider-anchored scrolling, Google Maps retry.
(function initLaPazRuntimePolish() {
    const SLIDE_MS = 5000;

    function ready(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    ready(() => {
        document.documentElement.style.setProperty('--lapaz-slide-duration', `${SLIDE_MS / 1000}s`);

        initDividerAnchorScroll();
        initGoogleMapRetry();
    });

    function getFixedNavOffset() {
        const nav = document.querySelector('nav');
        if (!nav) return 0;

        const style = window.getComputedStyle(nav);
        const isFixed = style.position === 'fixed' || style.position === 'sticky';

        if (!isFixed) return 0;

        return Math.ceil(nav.getBoundingClientRect().height);
    }

    function getDividerForSection(section) {
        if (!section) return null;

        let node = section.previousElementSibling;

        while (node) {
            if (node.classList?.contains('divider')) return node;

            const isOnlySpacer =
                node.tagName === 'DIV' &&
                !node.id &&
                !node.className &&
                node.textContent.trim() === '';

            if (!isOnlySpacer) return null;

            node = node.previousElementSibling;
        }

        return null;
    }

    function scrollToSectionDivider(target, hash, shouldReplaceHistory) {
        const divider = getDividerForSection(target);
        const anchor = divider || target;
        const navOffset = getFixedNavOffset();

        const EXTRA_GAP = -8;
        const top = Math.ceil(anchor.getBoundingClientRect().top + window.pageYOffset - navOffset) + EXTRA_GAP;

        window.scrollTo({
            top,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });

        if (hash) {
            const historyMethod = shouldReplaceHistory ? 'replaceState' : 'pushState';
            window.history[historyMethod](null, '', hash);
        }
    }

    function initDividerAnchorScroll() {
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href === '#') {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.history.pushState(null, '', window.location.pathname + window.location.search);
                return;
            }

            let target = null;

            try {
                target = document.querySelector(decodeURIComponent(href));
            } catch (error) {
                target = document.querySelector(href);
            }

            if (!target) return;

            event.preventDefault();
            scrollToSectionDivider(target, href, false);
        });

        if (window.location.hash) {
            const hash = window.location.hash;

            window.setTimeout(() => {
                let target = null;

                try {
                    target = document.querySelector(decodeURIComponent(hash));
                } catch (error) {
                    target = document.querySelector(hash);
                }

                if (target) scrollToSectionDivider(target, hash, true);
            }, 120);
        }

        window.addEventListener('hashchange', () => {
            if (!window.location.hash) return;

            let target = null;

            try {
                target = document.querySelector(decodeURIComponent(window.location.hash));
            } catch (error) {
                target = document.querySelector(window.location.hash);
            }

            if (target) scrollToSectionDivider(target, window.location.hash, true);
        });
    }

    function initGoogleMapRetry() {
        document.querySelectorAll('iframe.map-iframe').forEach((iframe) => {
            const box = iframe.closest('.map-box');
            if (!box) return;

            const originalSrc = iframe.getAttribute('src');
            if (!originalSrc) return;

            let loaded = false;
            let attempts = 0;
            const maxAttempts = 2;

            box.classList.add('is-map-loading');

            const detail = box.querySelector('.map-detail');
            if (detail && !detail.querySelector('.map-reload-btn')) {
                const reloadBtn = document.createElement('button');
                reloadBtn.type = 'button';
                reloadBtn.className = 'map-reload-btn';
                reloadBtn.textContent = 'Tải lại bản đồ';
                reloadBtn.addEventListener('click', () => reloadMap(true));
                detail.appendChild(reloadBtn);
            }

            iframe.addEventListener('load', () => {
                loaded = true;
                box.classList.remove('is-map-loading', 'is-map-failed');
                box.classList.add('is-map-loaded');
            });

            iframe.addEventListener('error', () => {
                loaded = false;
                reloadMap(false);
            });

            function withCacheBust(src) {
                const joiner = src.includes('?') ? '&' : '?';
                return `${src}${joiner}lapaz_reload=${Date.now()}`;
            }

            function reloadMap(force) {
                if (!force && attempts >= maxAttempts) {
                    box.classList.remove('is-map-loading');
                    box.classList.add('is-map-failed');
                    return;
                }

                attempts += 1;
                loaded = false;
                box.classList.add('is-map-loading');
                box.classList.remove('is-map-loaded', 'is-map-failed');

                iframe.src = 'about:blank';

                window.setTimeout(() => {
                    iframe.src = withCacheBust(originalSrc);
                }, 120);

                window.setTimeout(() => {
                    if (!loaded) reloadMap(false);
                }, 4500);
            }

            const startLoading = () => {
                iframe.loading = 'eager';

                window.setTimeout(() => {
                    if (!loaded) reloadMap(false);
                }, 4500);
            };

            if ('IntersectionObserver' in window) {
                const io = new IntersectionObserver((entries) => {
                    if (entries.some((entry) => entry.isIntersecting)) {
                        startLoading();
                        io.disconnect();
                    }
                }, { rootMargin: '280px 0px' });

                io.observe(box);
            } else {
                startLoading();
            }
        });
    }
})();
