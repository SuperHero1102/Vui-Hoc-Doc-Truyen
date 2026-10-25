import confetti from 'canvas-confetti';

/**
 * Hiệu ứng pháo hoa rực rỡ (Fireworks Celebration) khi bé hoàn thành một chủ đề bài học
 * Sử dụng canvas-confetti với nhiều đợt bắn từ các góc và trung tâm màn hình,
 * kết hợp hình ngôi sao, vòng tròn và dải màu tươi sáng pastel của trẻ thơ.
 */
export function fireFireworksCelebration(): void {
  const durationMs = 3200;
  const animationEnd = Date.now() + durationMs;

  const colors = ['#38BDF8', '#FBBF24', '#F472B6', '#34D399', '#A78BFA', '#FB923C'];

  // Đợt 1: Bắn pháo hoa trung tâm ngay lập tức
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.6 },
    colors,
    shapes: ['circle', 'star'],
    scalar: 1.2,
  });

  // Đợt 2: Pháo hoa định kỳ bắn từ 2 bên mép dưới màn hình kéo dài hơn 3 giây
  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 40 * (timeLeft / durationMs);

    // Bắn từ bên trái
    confetti({
      particleCount: Math.floor(particleCount),
      angle: 60,
      spread: 65,
      origin: { x: 0.05, y: 0.8 },
      colors,
      shapes: ['circle', 'star'],
      scalar: 1.1,
    });

    // Bắn từ bên phải
    confetti({
      particleCount: Math.floor(particleCount),
      angle: 120,
      spread: 65,
      origin: { x: 0.95, y: 0.8 },
      colors,
      shapes: ['circle', 'star'],
      scalar: 1.1,
    });
  }, 300);
}

/**
 * Hiệu ứng pháo hoa ngôi sao nhỏ mừng khi bé trả lời đúng một từ vựng
 */
export function fireStarExplosion(x = 0.5, y = 0.5): void {
  confetti({
    particleCount: 30,
    spread: 60,
    origin: { x, y },
    colors: ['#FBBF24', '#F59E0B', '#38BDF8', '#34D399'],
    shapes: ['star'],
    scalar: 0.9,
    ticks: 120,
  });
}
