// Hero slideshow preserved from former inline script.
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');
const heroBg = document.querySelector('.hero-r-bg');
const counterCur = document.querySelector('.hero-counter-cur');
const SLIDE_COLORS = [
    '#153232',
    '#1A3A3A',
    '#0F2A2A',
    '#122E2E',
    '#1E3838',
];

let current = 0;
let timer;

function goSlide(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');

    if (heroBg) heroBg.style.background = SLIDE_COLORS[current];
    if (counterCur) counterCur.textContent = String(current + 1).padStart(2, '0');

    resetTimer();
}

function nextSlide() { goSlide(current + 1); }

function resetTimer() {
    clearInterval(timer);
    timer = setInterval(nextSlide, 5000);
}

document.addEventListener('visibilitychange', () => {
    document.hidden ? clearInterval(timer) : resetTimer();
});

if (heroBg) heroBg.style.background = SLIDE_COLORS[0];
resetTimer();
