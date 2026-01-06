const myBtn = document.getElementById('myBtn');
const track = document.getElementById('track');
const minInput = document.getElementById('minInput');
const maxInput = document.getElementById('maxInput');

let currentMin = 1;
let currentMax = 60;
const repeats = 7;

function getMinMax() {
    const rawMin = minInput.value.trim();
    const rawMax = maxInput.value.trim();

    let min = rawMin === '' ? currentMin : (parseInt(rawMin) || currentMin);
    let max = rawMax === '' ? currentMax : (parseInt(rawMax) || currentMax);

    min = Math.max(1, Math.min(min, 999));
    max = Math.max(2, Math.min(max, 1000));

    if (min >= max) {
        max = Math.min(min + 1, 1000);
    }
    return { min, max };
}

function buildNumbers(min, max) {
    track.innerHTML = '';
    for (let r = 0; r < repeats; r++) {
        for (let i = min; i <= max; i++) {
            const div = document.createElement('div');
            div.className = 'number';
            div.textContent = i;
            track.appendChild(div);
        }
    }
}

function getNumberWidth() {
    const numbers = track.querySelectorAll('.number');
    if (numbers.length === 0) return 100;
    const first = numbers[0];
    const style = getComputedStyle(first);
    return first.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
}

function setCenteredPosition() {
    const numberWidth = getNumberWidth();
    const rouletteWidth = document.querySelector('.roulette').offsetWidth;
    const visibleOffset = (rouletteWidth - numberWidth) / 2;

    const numbersPerCycle = currentMax - currentMin + 1;
    const middleRepeat = Math.floor(repeats / 2);
    const indexOfMiddleStart = middleRepeat * numbersPerCycle;

    track.style.transition = 'none';
    track.style.transform = `translateX(-${indexOfMiddleStart * numberWidth - visibleOffset}px)`;
}

function rebuildAndReset() {
    const { min, max } = getMinMax();

    if (minInput.value.trim() !== '' && maxInput.value.trim() !== '') {
        currentMin = min;
        currentMax = max;
    }

    buildNumbers(currentMin, currentMax);
    track.offsetHeight; 
    setCenteredPosition();
}

minInput.addEventListener('input', rebuildAndReset);
maxInput.addEventListener('input', rebuildAndReset);

window.addEventListener('resize', () => {
    if (track.children.length > 0) {
        setCenteredPosition();
    }
});

rebuildAndReset();

myBtn.onclick = () => {
    const { min, max } = getMinMax(); 
    const winningNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    const numberWidth = getNumberWidth();
    const rouletteWidth = document.querySelector('.roulette').offsetWidth;
    const visibleOffset = (rouletteWidth - numberWidth) / 2;

    const numbersPerCycle = currentMax - currentMin + 1;
    const middleRepeat = Math.floor(repeats / 2);
    const startIndex = middleRepeat * numbersPerCycle;

    track.style.transition = 'none';
    track.style.transform = `translateX(-${startIndex * numberWidth - visibleOffset}px)`;
    track.offsetHeight; 

    let spins = 3;
    let duration = '5s';

    if (numbersPerCycle > 100) {
        spins = 1;
        duration = '4.5s';
    }
    if (numbersPerCycle > 300) {
        spins = 1;
        duration = '4s';
    }

    const extraDistance = (winningNumber - currentMin) * numberWidth;
    const totalDistance = spins * numbersPerCycle * numberWidth + extraDistance;

    track.style.transition = `transform ${duration} cubic-bezier(0.1, 0.7, 0.1, 1)`;
    track.style.transform = `translateX(-${startIndex * numberWidth - visibleOffset + totalDistance}px)`;

    track.addEventListener('transitionend', function handler() {
        const winningIndex = startIndex + (winningNumber - currentMin);
        track.style.transition = 'none';
        track.style.transform = `translateX(-${winningIndex * numberWidth - visibleOffset}px)`;
        track.removeEventListener('transitionend', handler);
    }, { once: true });
};