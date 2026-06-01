// ── CAFE MENU TABS — legacy compatibility ──────────────────────────────────
function switchTab(btn, panelId) {
    document.querySelectorAll('.mtab').forEach((t) => t.classList.remove('on'));
    document.querySelectorAll('.mpanel').forEach((p) => p.classList.remove('on'));
    if (btn) btn.classList.add('on');
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add('on');

    document.querySelectorAll('.cafe-menu-img-main').forEach((img) => img.classList.remove('cmv-active'));
    const def = document.querySelector('.cmv-default');
    if (def) def.classList.add('cmv-active');
}
window.switchTab = switchTab;

// ── INTERACTIVE CAFE MENU — tabs + product image hover/click ────────────────
(function initCafeProductMenu() {
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    ready(() => {
        const section = document.querySelector('#cafe');
        if (!section) return;

        const tabs = [...section.querySelectorAll('.cafe-menu-tab[data-cafe-tab]')];
        const board = section.querySelector('.cafe-menu-board');
        const panels = [...section.querySelectorAll('.cafe-menu-panel[data-cafe-panel]')];
        const productImages = [...section.querySelectorAll('.cafe-product-img[data-product-key]')];
        const title = section.querySelector('#cafeProductTitle');
        const caption = section.querySelector('#cafeProductCaption');
        let mobileSelect = null;

        function ensureMobileDropdown() {
            const tabsWrap = section.querySelector('.cafe-menu-tabs');
            if (!tabsWrap || section.querySelector('.cafe-menu-select-wrap')) return;

            const wrap = document.createElement('label');
            wrap.className = 'cafe-menu-select-wrap';
            wrap.innerHTML = `
                <span class="cafe-menu-select-label">Chọn nhóm món</span>
                <select class="cafe-menu-select" aria-label="Chọn nhóm món trong menu cafe"></select>
            `;

            mobileSelect = wrap.querySelector('.cafe-menu-select');
            tabs.forEach((tab) => {
                const option = document.createElement('option');
                option.value = tab.dataset.cafeTab;
                option.textContent = tab.textContent.trim();
                mobileSelect.appendChild(option);
            });

            mobileSelect.addEventListener('change', () => activateTab(mobileSelect.value));
            tabsWrap.insertAdjacentElement('afterend', wrap);
        }

        const categoryDefaults = {
            coffee: {
                title: 'Cà phê phin',
                caption: 'Đen nóng / đá, nâu nóng / đá, bạc xỉu và kem trứng.',
                price: '25k – 30k'
            },
            matcha: {
                title: 'Matcha',
                caption: 'Matcha latte, matcha dừa và matcha xoài.',
                price: '35k'
            },
            tea: {
                title: 'Trà',
                caption: 'Trà chanh, trà tắc, trà đào cam sả và trà hoa quả nhiệt đới.',
                price: '20k – 25k'
            },
            juice: {
                title: 'Nước hoa quả',
                caption: 'Chanh tươi, cam tươi, chanh leo, ép dưa hấu và ép cam cà rốt.',
                price: '25k – 30k'
            },
            smoothie: {
                title: 'Sinh tố',
                caption: 'Bơ, xoài, mãng cầu, chanh leo và chanh leo tuyết.',
                price: '35k'
            },
            'milk-tea': {
                title: 'Trà sữa',
                caption: 'Trà sữa socola, khoai môn, sữa tươi trân châu và trà sữa matcha.',
                price: '25k – 30k'
            },
            dessert: {
                title: 'Pudding',
                caption: 'Kem trứng, matcha, panna cotta và tàu hũ.',
                price: '10k – 15k'
            },
            topping: {
                title: 'Topping',
                caption: 'Khúc bạch, thạch trà và topping lá nếp.',
                price: '5k'
            },
            yogurt: {
                title: 'Sữa chua & đá xay',
                caption: 'Sữa chua đá nguyên vị, sữa chua mix vị và đá xay kem tươi.',
                price: '25k – 30k'
            }
        };

        function updateProductVisual(key, override) {
            const fallback = categoryDefaults[key] || categoryDefaults.coffee;
            productImages.forEach((img) => img.classList.toggle('is-active', img.dataset.productKey === key));

            if (title) title.textContent = override?.title || fallback.title;
            if (caption) caption.textContent = override?.caption || fallback.caption;
        }

        function activateTab(key) {
            if (board) {
                board.classList.remove('is-switching');
                // Force reflow so CSS animation restarts smoothly on every tab change.
                void board.offsetWidth;
                board.classList.add('is-switching');
                window.setTimeout(() => board.classList.remove('is-switching'), 380);
            }

            tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.cafeTab === key));
            panels.forEach((panel) => {
                const isTarget = panel.dataset.cafePanel === key;
                panel.classList.toggle('is-active', isTarget);
                if (isTarget) panel.scrollTop = 0;
            });
            section.querySelectorAll('.cafe-menu-card.is-hovered').forEach((el) => el.classList.remove('is-hovered'));
            if (mobileSelect && mobileSelect.value !== key) mobileSelect.value = key;
            updateProductVisual(key);
        }

        ensureMobileDropdown();

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => activateTab(tab.dataset.cafeTab));
        });

        // Ảnh minh họa chỉ đổi theo tab đang chọn.
        // Các món trong tab vẫn có hiệu ứng hover/focus để người dùng biết đang trỏ vào món nào,
        // nhưng không còn đổi ảnh/title/caption theo từng món để tránh kẹt ảnh sai.
        section.querySelectorAll('.cafe-menu-card[data-product-key]').forEach((item) => {
            const setHovered = () => {
                section.querySelectorAll('.cafe-menu-card.is-hovered').forEach((el) => el.classList.remove('is-hovered'));
                item.classList.add('is-hovered');
            };
            item.addEventListener('mouseenter', setHovered);
            item.addEventListener('focusin', setHovered);
            item.addEventListener('click', setHovered);
        });

        activateTab('coffee');
    });
})();

// ── JUMP TO CAFE TAB FROM OTHER LINKS ─────────────────────
(function initCafeJumpLinks() {
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    ready(() => {
        document.querySelectorAll('[data-cafe-jump]').forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const key = link.dataset.cafeJump;
                const cafeSection = document.querySelector('#cafe');
                const targetTab = document.querySelector(
                    `#cafe .cafe-menu-tab[data-cafe-tab="${key}"]`
                );

                if (!cafeSection || !targetTab) return;

                cafeSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                window.setTimeout(() => {
                    targetTab.click();
                }, 350);
            });
        });
    });
})();
