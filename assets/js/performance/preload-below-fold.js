// Below-the-fold image preloading preserved from former inline script.
function goToCafeTab(tabId) {
    const btn = document.querySelector(`button[onclick="switchTab(this,'${tabId}')"]`);
    if (btn) switchTab(btn, tabId);
}

(function preloadBelowFold() {
    const GROUP3 = [
        'photos/phong_2_giuong.webp',
        'photos/phong_1_giuong.webp',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop',
        'photos/kim_boi.webp',
        'photos/thac_may.webp',
        'photos/cuc_phuong.webp',
        'photos/trang_an.webp',
        'photos/chua_hang.webp',
        'photos/chua_tac_duc.webp',
        'photos/suoi_ca_cam_thuy.webp',
    ];

    const heroImg = document.querySelector('.hero-img-wrap img');
    function startPreload() {
        GROUP3.forEach((src, i) => {
            setTimeout(() => {
                const img = new Image();
                img.src = src;
            }, i * 150);
        });
    }

    if (heroImg && !heroImg.complete) {
        heroImg.addEventListener('load', startPreload, { once: true });
        setTimeout(startPreload, 3000);
    } else {
        startPreload();
    }
})();
