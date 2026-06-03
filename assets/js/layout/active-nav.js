(function () {
    'use strict';

    const qs = window.LaPaz.qs;
    const qsa = window.LaPaz.qsa;

    (function initActiveNav() {
        const navLinks = qsa('.nav-links a[href^="#"], .m-nav a[href^="#"]')
            .filter((a) => {
                const href = a.getAttribute('href');
                return href && href !== '#contact' && !a.classList.contains('nav-cta');
            });

        if (!navLinks.length) return;

        const linkIds = new Set(navLinks.map((a) => a.getAttribute('href').slice(1)));
        const sections = Array.from(document.querySelectorAll('section[id]'))
            .filter((section) => linkIds.has(section.id) || section.id === 'contact');

        if (!sections.length) return;

        const getNavHeight = () => qs('#nav')?.offsetHeight || 70;

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

        function getSectionStart(section) {
            const anchor = getDividerBeforeSection(section) || section;
            return window.scrollY + anchor.getBoundingClientRect().top;
        }

        function clearActive() {
            navLinks.forEach((a) => a.classList.remove('nav-active'));
        }

        function setActive(id) {
            navLinks.forEach((a) => {
                a.classList.toggle('nav-active', a.getAttribute('href') === `#${id}`);
            });
        }

        function update() {
            const scrollLine = window.scrollY + getNavHeight() + 8;
            let active = null;

            for (const section of sections) {
                if (getSectionStart(section) <= scrollLine) active = section;
                else break;
            }

            if (!active || active.id === 'contact') {
                clearActive();
                return;
            }

            setActive(active.id);
        }

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                update();
                ticking = false;
            });
        }, { passive: true });

        window.addEventListener('resize', update);
        window.addEventListener('load', update);
        update();
    })();
})();
