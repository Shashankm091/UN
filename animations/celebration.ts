import confetti from "canvas-confetti";

const softPalette = ["#FFD6E8", "#C9A9E9", "#9B6FD9", "#FFE8B8", "#FFFFFF"];

export function burstConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: softPalette,
    scalar: 0.9,
    ticks: 200,
  });
}

export function massiveConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 65,
      origin: { x: 0 },
      colors: softPalette,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 65,
      origin: { x: 1 },
      colors: softPalette,
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export function fireworks() {
  const duration = 4000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: Math.random(),
        y: Math.random() * 0.4,
      },
      colors: softPalette,
      shapes: ["circle"],
      scalar: 1.1,
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
