/* La Paz Hotel — Main JS entrypoint
   Chỉ cần gọi file này. Runtime scroll được quản lý riêng bởi assets/js/lapaz-runtime-polish.js. */
(function loadLaPazScripts() {
    const base = 'assets/js/';
    const scripts = [
        'core/dom-utils.js',
        'layout/nav-scroll.js',
        'layout/mobile-menu.js',
        'components/reveal.js',
        'performance/blur-up-images.js',
        'sections/cafe-menu.js',
        'performance/scroll-restoration.js',
        // Anchor scroll được xử lý tập trung trong lapaz-runtime-polish.js
        // để tránh smooth-scroll.js và hash-scroll-compat.js kéo chồng nhau.
        'performance/preload-below-fold.js',
        'sections/hero-slideshow.js',
        'components/scroll-progress.js',
        'layout/active-nav.js',
        'layout/divider-ornaments.js',
        'components/mobile-bottom-bar.js',
        'sections/hero-slide-progress.js',
        'components/motion-polish.js',
    ];

    document.write(scripts.map((src) => `<script src="${base}${src}"></script>`).join(''));
})();
