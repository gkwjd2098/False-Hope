const symbols = ["🍒", "🍋", "🍉", "🍇", "🍓", "🍊", "🍌", "7️⃣"];
const reels = document.querySelectorAll('.reel');
const spinButton = document.getElementById('spinButton');
const resetButton = document.getElementById('resetButton');
const darkOverlay = document.querySelector('.dark-overlay');
const falseHopeText = document.querySelector('.text-wrapper');
const moneyContainer = document.getElementById('moneyContainer');

let isFirstSpin = true;
let spinCount = 0;

function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function createMoneyDrain() {
  const moneySymbols = ['💵', '💰', '💸', '🪙'];
  for (let i = 0; i < 20; i++) {
    const money = document.createElement('div');
    money.classList.add('money');
    money.textContent = moneySymbols[Math.floor(Math.random() * moneySymbols.length)];
    money.style.left = `${Math.random() * 100}%`;
    money.style.animation = `fall 2s linear ${Math.random() * 2}s forwards`;
    moneyContainer.appendChild(money);
    setTimeout(() => money.remove(), 4000);
  }
}

function spin() {
  if (spinCount >= 5) return; // Prevent further spins after blackout

  spinButton.style.pointerEvents = 'none';
  spinCount++;

  createMoneyDrain(); // Add money drain effect

  if (spinCount === 5) {
    // Complete blackout on 5th spin
    darkOverlay.style.opacity = '1';
    setTimeout(() => {
      falseHopeText.style.opacity = '1';
      resetButton.style.opacity = '1';
    }, 1000);
    return;
  }

  if (!isFirstSpin) {
    // Gradually darken the screen
    darkOverlay.style.opacity = (spinCount * 0.2).toString();
  }

  let completedReels = 0;

  reels.forEach((reel, index) => {
    const duration = 1000 + index * 300;
    let symbolSequence = [];

    for (let i = 0; i < 30; i++) {
      if (isFirstSpin && i === 29) {
        symbolSequence.push("7️⃣");
      } else {
        symbolSequence.push(getRandomSymbol());
      }
    }

    animateReel(reel, symbolSequence, duration, () => {
      completedReels++;
      if (completedReels === reels.length) {
        spinButton.style.pointerEvents = 'auto';
        if (isFirstSpin) {
          reels.forEach(reel => reel.classList.add('shine'));
          setTimeout(() => {
            reels.forEach(reel => reel.classList.remove('shine'));
          }, 1500);
          isFirstSpin = false;
        }
      }
    });
  });
}

function animateReel(reel, symbols, duration, onComplete) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const index = Math.floor((progress / duration) * symbols.length) % symbols.length;
    reel.textContent = symbols[index];
    if (progress < duration) {
      window.requestAnimationFrame(step);
    } else {
      reel.textContent = symbols[symbols.length - 1];
      if (onComplete) onComplete();
    }
  };
  window.requestAnimationFrame(step);
}

function reset() {
  isFirstSpin = true;
  spinCount = 0;
  darkOverlay.style.opacity = '0';
  falseHopeText.style.opacity = '0';
  resetButton.style.opacity = '0';
  reels.forEach(reel => {
    reel.textContent = getRandomSymbol();
  });
  spinButton.style.pointerEvents = 'auto';
  moneyContainer.innerHTML = ''; // Clear any remaining money symbols
}

spinButton.addEventListener('click', spin);
resetButton.addEventListener('click', reset);

spinButton.addEventListener('mousedown', () => {
  spinButton.style.transform = 'translateX(-50%) scale(0.95)';
});

spinButton.addEventListener('mouseup', () => {
  spinButton.style.transform = 'translateX(-50%) scale(1)';
});

// Initialize reels
reels.forEach(reel => {
  reel.textContent = getRandomSymbol();
});
