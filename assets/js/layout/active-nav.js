(function () {
    'use strict';

    const qs = window.LaPaz.qs;
    const qsa = window.LaPaz.qsa;

    (function initActiveNav() {
        /*
          Contact không cần active.
          Nhưng contact vẫn được dùng như một vùng chặn để khi kéo tới contact
          thì xoá highlight của section trước đó, thay vì giữ attractions.
        */
        const navLinks = qsa('.nav-links a[href^="#"], .m-nav a[href^="#"]')
            .filter((a) => {
                const href = a.getAttribute('href');
                return href && href !== '#contact' && !a.classList.contains('nav-cta');
            });

        const trackedSections = navLinks
            .map((a) => {
                const id = a.getAttribute('href').slice(1);
                return id ? document.getElementById(id) : null;
            })
            .filter(Boolean);

        const contactSection = document.getElementById('contact');
        const sections = contactSection
            ? [...trackedSections, contactSection]
            : trackedSections;

        if (!sections.length || !navLinks.length) return;

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
            const divider = getDividerBeforeSection(section);
            const anchor = divider || section;

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
                if (getSectionStart(section) <= scrollLine) {
                    active = section;
                } else {
                    break;
                }
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
