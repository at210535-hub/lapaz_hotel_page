// Rooms mobile slider — smooth fade/slide version.
// Đặt sau main.js. Desktop không bị ảnh hưởng.
(function initRoomsMobileSlider() {
    const BREAKPOINT = 960;
    const INTERVAL = 5000;
    const LEAVE_MS = 680;

    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    ready(() => {
        const track = document.querySelector('.rooms-grid--2');
        if (!track) return;

        const cards = Array.from(track.querySelectorAll('.room-card'));
        if (cards.length <= 1) return;

        let index = 0;
        let previousIndex = 0;
        let timer = null;
        let enabled = false;
        let ui = null;
        let dots = [];
        let direction = 1;

        function isMobile() {
            return window.innerWidth <= BREAKPOINT;
        }

        function buildUI() {
            if (ui) return;

            ui = document.createElement('div');
            ui.className = 'rooms-slider-ui';
            ui.setAttribute('aria-label', 'Điều hướng phòng nghỉ');

            dots = cards.map((_, dotIndex) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'rooms-slider-dot';
                dot.setAttribute('aria-label', `Xem phòng ${dotIndex + 1}`);
                dot.addEventListener('click', () => {
                    if (dotIndex === index) return;
                    direction = dotIndex > index ? 1 : -1;
                    goTo(dotIndex);
                });
                ui.appendChild(dot);
                return dot;
            });

            track.insertAdjacentElement('afterend', ui);
        }

        function restartDot(dot) {
            dot.classList.remove('is-active');
            void dot.offsetWidth;
            dot.classList.add('is-active');
        }

        function setTrackHeight() {
            const active = cards[index];
            if (!active || !enabled) return;

            const height = active.offsetHeight;
            if (height > 0) {
                track.style.height = `${height}px`;
            }
        }

        function render() {
            track.classList.toggle('is-room-prev', direction < 0);

            cards.forEach((card, cardIndex) => {
                card.classList.remove('is-room-leaving');

                const isActive = cardIndex === index;
                const wasPrevious = cardIndex === previousIndex && previousIndex !== index;

                card.classList.toggle('is-room-active', isActive);

                if (wasPrevious) {
                    card.classList.add('is-room-leaving');
                    window.clearTimeout(card.__roomLeaveTimer);
                    card.__roomLeaveTimer = window.setTimeout(() => {
                        card.classList.remove('is-room-leaving');
                    }, LEAVE_MS);
                }
            });

            dots.forEach((dot, dotIndex) => {
                dot.classList.toggle('is-active', dotIndex === index);
            });

            if (dots[index]) restartDot(dots[index]);

            requestAnimationFrame(setTrackHeight);
        }

        function schedule() {
            window.clearTimeout(timer);
            if (!enabled) return;

            timer = window.setTimeout(() => {
                direction = 1;
                goTo((index + 1) % cards.length);
            }, INTERVAL);
        }

        function goTo(nextIndex) {
            previousIndex = index;
            index = (nextIndex + cards.length) % cards.length;
            render();
            schedule();
        }

        function enable() {
            if (enabled) return;

            enabled = true;
            buildUI();
            track.classList.add('rooms-mobile-slider');

            cards.forEach((card) => {
                card.classList.remove('is-room-active', 'is-room-leaving');
            });

            cards[index].classList.add('is-room-active');
            render();
            schedule();
        }

        function disable() {
            if (!enabled) return;

            enabled = false;
            window.clearTimeout(timer);
            track.classList.remove('rooms-mobile-slider', 'is-room-prev');
            track.style.height = '';

            cards.forEach((card) => {
                card.classList.remove('is-room-active', 'is-room-leaving');
            });

            dots.forEach((dot) => dot.classList.remove('is-active'));
        }

        function refresh() {
            if (isMobile()) {
                enable();
                render();
                schedule();
            } else {
                disable();
            }
        }

        let startX = 0;
        let startY = 0;

        track.addEventListener('touchstart', (event) => {
            if (!enabled) return;
            const touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        }, { passive: true });

        track.addEventListener('touchend', (event) => {
            if (!enabled) return;
            const touch = event.changedTouches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;

            if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
                direction = dx < 0 ? 1 : -1;
                goTo(index + direction);
            }
        }, { passive: true });

        refresh();

        let resizeTimer = null;
        window.addEventListener('resize', () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(refresh, 120);
        });
    });
})();
