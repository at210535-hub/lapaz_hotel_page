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