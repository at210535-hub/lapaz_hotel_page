(function initLaPazRevolverSlider() {
    const AUTO_DELAY = 5000;
    const MOBILE_BP = 960;
    const configs = [
        { label: 'Tham quan', sectionSelector: '.attractions', trackSelector: '.attr-grid', itemSelector: '.ac', mobileOnly: false, desktopFocusCount: 3, mobileFocusCount: 1 },
        { label: 'Tiện ích', sectionSelector: '.nearby', trackSelector: '.nearby-grid', itemSelector: '.nb-card', mobileOnly: true, desktopFocusCount: 1, mobileFocusCount: 1 }
    ];

    function ready(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    const isMobile = () => window.innerWidth <= MOBILE_BP;
    const mod = (value, total) => ((value % total) + total) % total;

    function focusCount(state) {
        return Math.min(isMobile() ? state.mobileFocusCount : state.desktopFocusCount, state.items.length);
    }

    function clearItem(item) {
        item.classList.remove('is-revolver-focus', 'is-revolver-edge', 'is-revolver-left', 'is-revolver-right', 'is-revolver-enter');
        item.style.removeProperty('order');
        clearTimeout(item.__lapazEnterTimer);
    }

    function restartProgress(state) {
        if (!state.status) return;
        state.status.classList.remove('is-running');
        void state.status.offsetWidth;
        state.status.classList.add('is-running');
    }

    function markDirection(state, direction) {
        state.track.classList.remove('is-revolver-next', 'is-revolver-prev');
        void state.track.offsetWidth;
        state.track.classList.add(direction > 0 ? 'is-revolver-next' : 'is-revolver-prev');
        clearTimeout(state.directionTimer);
        state.directionTimer = setTimeout(() => state.track.classList.remove('is-revolver-next', 'is-revolver-prev'), 760);
    }

    function render(state, direction = 1) {
        if (!state.enabled || !state.items.length) return;

        const total = state.items.length;
        const count = focusCount(state);
        const visible = [
            { index: mod(state.index - 1, total), role: 'edge', side: 'left' },
            ...Array.from({ length: count }, (_, i) => ({ index: mod(state.index + i, total), role: 'focus', side: 'center' })),
            { index: mod(state.index + count, total), role: 'edge', side: 'right' }
        ];
        const map = new Map(visible.map((entry, slot) => [entry.index, { ...entry, slot }]));

        state.items.forEach((item, itemIndex) => {
            const wasVisible = item.classList.contains('is-revolver-focus') || item.classList.contains('is-revolver-edge');
            clearItem(item);
            const data = map.get(itemIndex);
            if (!data) return;

            item.style.order = String(data.slot);
            item.classList.add(data.role === 'focus' ? 'is-revolver-focus' : 'is-revolver-edge');
            if (data.role === 'edge') item.classList.add(data.side === 'left' ? 'is-revolver-left' : 'is-revolver-right');

            if (!wasVisible || state.forceEnter) {
                void item.offsetWidth;
                item.classList.add('is-revolver-enter');
                item.__lapazEnterTimer = setTimeout(() => item.classList.remove('is-revolver-enter'), 760);
            }
        });

        markDirection(state, direction);
        restartProgress(state);
        state.forceEnter = false;
    }

    function schedule(state) {
        clearTimeout(state.autoTimer);
        if (state.enabled) state.autoTimer = setTimeout(() => move(state, 1), AUTO_DELAY);
    }

    function move(state, direction) {
        if (!state.enabled || state.items.length <= 1) return;
        state.index = mod(state.index + direction, state.items.length);
        render(state, direction);
        schedule(state);
    }

    function buildUI(state) {
        if (state.ui) return;

        const oldUi = state.track.previousElementSibling;
        if (oldUi?.classList?.contains('lapaz-slider-ui')) oldUi.remove();

        const ui = document.createElement('div');
        ui.className = 'lapaz-slider-ui';
        ui.setAttribute('aria-label', `Điều hướng ${state.label}`);

        const status = document.createElement('div');
        status.className = 'lapaz-slider-status';
        status.setAttribute('aria-hidden', 'true');

        const controls = document.createElement('div');
        controls.className = 'lapaz-slider-controls';

        const prev = document.createElement('button');
        prev.type = 'button';
        prev.className = 'lapaz-slider-btn';
        prev.textContent = '‹';
        prev.setAttribute('aria-label', `${state.label} trước`);

        const next = document.createElement('button');
        next.type = 'button';
        next.className = 'lapaz-slider-btn';
        next.textContent = '›';
        next.setAttribute('aria-label', `${state.label} tiếp theo`);

        controls.append(prev, next);
        ui.append(status, controls);
        state.track.insertAdjacentElement('beforebegin', ui);
        state.ui = ui;
        state.status = status;

        prev.addEventListener('click', () => move(state, -1));
        next.addEventListener('click', () => move(state, 1));

        let startX = 0;
        let startY = 0;
        state.track.addEventListener('touchstart', (event) => {
            const touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        }, { passive: true });

        state.track.addEventListener('touchend', (event) => {
            const touch = event.changedTouches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;
            if (Math.abs(dx) > 38 && Math.abs(dx) > Math.abs(dy)) move(state, dx < 0 ? 1 : -1);
        }, { passive: true });
    }

    function shouldEnable(state) {
        return !state.mobileOnly || isMobile();
    }

    function enable(state) {
        if (state.enabled) return;
        state.enabled = true;
        state.forceEnter = true;
        state.track.dataset.lapazRevolver = 'active';
        buildUI(state);
        render(state, 1);
        schedule(state);
    }

    function disable(state) {
        if (!state.enabled) return;
        state.enabled = false;
        clearTimeout(state.autoTimer);
        clearTimeout(state.directionTimer);
        state.track.removeAttribute('data-lapaz-revolver');
        state.track.classList.remove('is-revolver-next', 'is-revolver-prev');
        state.items.forEach(clearItem);
        state.status?.classList.remove('is-running');
    }

    ready(() => {
        const states = configs.map((config) => {
            const section = document.querySelector(config.sectionSelector);
            const track = section?.querySelector(config.trackSelector);
            const items = track ? [...track.querySelectorAll(config.itemSelector)] : [];
            if (!section || !track || !items.length) return null;
            return { ...config, section, track, items, enabled: false, index: 0, autoTimer: null, directionTimer: null, ui: null, status: null, forceEnter: true };
        }).filter(Boolean);

        function refresh() {
            states.forEach((state) => {
                if (shouldEnable(state)) {
                    enable(state);
                    render(state, 1);
                    schedule(state);
                } else {
                    disable(state);
                }
            });
        }

        refresh();
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(refresh, 120);
        });
        window.addEventListener('orientationchange', () => setTimeout(refresh, 180));
    });
})();
