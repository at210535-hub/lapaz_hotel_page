/* La Paz Hotel — Main JS entrypoint
   HTML chỉ cần gọi file này. File này nạp các module classic theo đúng thứ tự phụ thuộc. */
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
        'layout/smooth-scroll.js',
        'layout/hash-scroll-compat.js',
        'performance/preload-below-fold.js',
        'sections/hero-slideshow.js',
        'components/scroll-progress.js',
        'layout/active-nav.js',
        'layout/divider-ornaments.js',
        'components/floating-booking.js',
        'components/mobile-bottom-bar.js',
        'sections/hero-slide-progress.js',
        'components/motion-polish.js',
    ];

    // document.write được dùng vì main.js được gọi bằng classic script ở cuối body,
    // giúp giữ thứ tự thực thi như các script gốc và vẫn expose các hàm inline onclick.
    document.write(scripts.map((src) => `<script src="${base}${src}"></script>`).join(''));
})();
