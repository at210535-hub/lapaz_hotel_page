// Compatibility layer preserved from former inline script.
(function fixNavScroll() {
    const NAV_HEIGHT = () => (document.getElementById('nav')?.offsetHeight || 70);

    function scrollToSection(id) {
        const target = document.getElementById(id);
        if (!target) return;

        const run = () => {
            const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT() - 8;
            window.scrollTo({ top, behavior: 'smooth' });
        };

        requestAnimationFrame(() => {
            if (document.readyState !== 'complete') {
                window.addEventListener('load', run, { once: true });
            } else {
                run();
            }
        });
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const id = link.getAttribute('href').slice(1);
        if (!id) return;
        e.preventDefault();
        history.pushState(null, '', '#' + id);
        scrollToSection(id);
    });

    if (location.hash) {
        const id = location.hash.slice(1);
        window.addEventListener('load', () => {
            setTimeout(() => scrollToSection(id), 100);
        }, { once: true });
    }
})();
