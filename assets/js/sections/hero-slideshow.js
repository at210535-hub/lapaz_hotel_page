// Hero slideshow + progress, self-contained.
// One source controls slide state, timer, dots and progress fill.
(function initHeroSlideshow() {
    'use strict';

    const SLIDE_DURATION = 5000;
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-dot'));
    const heroBg = document.querySelector('.hero-r-bg');
    const counterCur = document.querySelector('.hero-counter-cur');

    const SLIDE_COLORS = ['#153232', '#1A3A3A', '#0F2A2A', '#122E2E', '#1E3838'];

    if (!slides.length || !dots.length) return;

    let current = Math.max(0, dots.findIndex((dot) => dot.classList.contains('active')));
    let timer = null;

    document.documentElement.style.setProperty('--lapaz-slide-duration', `${SLIDE_DURATION / 1000}s`);

    function ensureProgressFill() {
        dots.forEach((dot) => {
            dot.style.setProperty('--lapaz-slide-duration', `${SLIDE_DURATION / 1000}s`);

            if (!dot.querySelector('.hero-dot-fill')) {
                const fill = document.createElement('span');
                fill.className = 'hero-dot-fill';
                fill.setAttribute('aria-hidden', 'true');
                dot.appendChild(fill);
            }
        });
    }

    function restartProgress() {
        ensureProgressFill();

        dots.forEach((dot, index) => {
            const fill = dot.querySelector('.hero-dot-fill');

            dot.classList.remove('running', 'is-running');

            if (fill) {
                fill.style.animation = 'none';
                fill.style.transform = 'scaleX(0)';
                void fill.offsetWidth;
            }

            if (index === current) {
                dot.classList.add('running', 'is-running');
                if (fill) fill.style.animation = `lapazUnifiedProgress ${SLIDE_DURATION}ms linear forwards`;
            }
        });
    }

    function setActive(index) {
        slides[current]?.classList.remove('active');
        dots[current]?.classList.remove('active', 'running', 'is-running');

        current = (index + slides.length) % slides.length;

        slides[current]?.classList.add('active');
        dots[current]?.classList.add('active');

        if (heroBg) heroBg.style.background = SLIDE_COLORS[current % SLIDE_COLORS.length];
        if (counterCur) counterCur.textContent = String(current + 1).padStart(2, '0');

        restartProgress();
    }

    function resetTimer() {
        clearInterval(timer);
        if (!document.hidden) timer = setInterval(() => goSlide(current + 1), SLIDE_DURATION);
    }

    function goSlide(index) {
        setActive(index);
        resetTimer();
    }

    window.goSlide = goSlide;
    window.nextSlide = function nextSlide() { goSlide(current + 1); };

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goSlide(index));
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(timer);
        } else {
            restartProgress();
            resetTimer();
        }
    });

    ensureProgressFill();
    setActive(current);
    resetTimer();
})();
