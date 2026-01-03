const myBtn = document.getElementById('myBtn');
const track = document.getElementById('track');
const min = 1;
const max = 60;
const repeats = 7;

function buildNumbers(min, max, repeats) {
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

// NEW FUNCTION – Set first number (1) under arrow
function setInitialPosition() {
    const numbers = track.querySelectorAll('.number');
    if (numbers.length === 0) return;

    // Include margins in number width
    const style = getComputedStyle(numbers[0]);
    const numberWidth = numbers[0].offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);

    const rouletteWidth = document.querySelector('.roulette').offsetWidth;
    const visibleOffset = (rouletteWidth - numberWidth) / 2;

    const middleRepeat = Math.floor(repeats / 2);
    const indexOfMiddleOne = middleRepeat * (max - min + 1);  // Index of '1' in middle repeat

    track.style.transition = 'none';
    track.style.transform = `translate3d(-${indexOfMiddleOne * numberWidth - visibleOffset}px, 0, 0)`;
}

// Build numbers and set initial position on load
buildNumbers(min, max, repeats);
setInitialPosition();

// Recalculate on window resize
window.addEventListener('resize', setInitialPosition);

myBtn.onclick = () => {
    const numbers = track.children;
    const style = getComputedStyle(numbers[0]);
    const numberWidth = numbers[0].offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);

    const winningNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const middleRepeat = Math.floor(repeats / 2);
    const startIndex = middleRepeat * (max - min + 1);

    const visibleOffset = (document.querySelector('.roulette').offsetWidth - numberWidth) / 2;

    // Reset to middle repeat start (instant)
    track.style.transition = 'none';
    track.style.transform = `translate3d(-${startIndex * numberWidth - visibleOffset}px, 0, 0)`;
    track.offsetHeight; // force reflow

    // Spin
    const spins = 3;
    const totalDistance = numberWidth * ((max - min + 1) * spins + (winningNumber - min));
    track.style.transition = 'transform 5s cubic-bezier(0.1, 0.7, 0.1, 1)';
    track.style.transform = `translate3d(-${startIndex * numberWidth - visibleOffset + totalDistance}px, 0, 0)`;

    // Snap to exact winning number
    track.addEventListener('transitionend', function handler() {
        track.style.transition = 'none';
        const winningIndex = startIndex + (winningNumber - min);
        track.style.transform = `translate3d(-${winningIndex * numberWidth - visibleOffset}px, 0, 0)`;
        track.removeEventListener('transitionend', handler);
    }, { once: true });
};
