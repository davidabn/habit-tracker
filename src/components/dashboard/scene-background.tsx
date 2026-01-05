'use client';

import { useState, useEffect, useMemo } from 'react';

type TimeOfDay = 'morning' | 'afternoon' | 'sunset' | 'night';

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 20) return 'sunset';
  return 'night';
}

const skyGradients: Record<TimeOfDay, string> = {
  morning: 'from-sky-300 via-sky-400 to-sky-500',
  afternoon: 'from-sky-400 via-sky-500 to-sky-600',
  sunset: 'from-orange-300 via-rose-400 to-purple-500',
  night: 'from-slate-900 via-indigo-950 to-slate-950',
};

// Stars with CSS positioning (% based, fixed pixel sizes)
const STARS: Array<{ x: number; y: number; size: number; delay: number; bright?: boolean }> = [
  // Tiny stars (1px) - spread across the sky
  { x: 5, y: 5, size: 1, delay: 0 },
  { x: 12, y: 12, size: 1, delay: 0.3 },
  { x: 18, y: 6, size: 1, delay: 0.7 },
  { x: 25, y: 18, size: 1, delay: 1.1 },
  { x: 32, y: 8, size: 1, delay: 0.5 },
  { x: 38, y: 22, size: 1, delay: 1.4 },
  { x: 42, y: 4, size: 1, delay: 0.2 },
  { x: 48, y: 15, size: 1, delay: 0.9 },
  { x: 52, y: 8, size: 1, delay: 1.6 },
  { x: 58, y: 20, size: 1, delay: 0.4 },
  { x: 62, y: 6, size: 1, delay: 1.2 },
  { x: 68, y: 14, size: 1, delay: 0.8 },
  { x: 72, y: 3, size: 1, delay: 1.5 },
  { x: 78, y: 18, size: 1, delay: 0.1 },
  { x: 82, y: 10, size: 1, delay: 0.6 },
  { x: 88, y: 24, size: 1, delay: 1.3 },
  { x: 92, y: 7, size: 1, delay: 0.4 },
  { x: 96, y: 16, size: 1, delay: 1.0 },
  { x: 8, y: 20, size: 1, delay: 0.8 },
  { x: 15, y: 4, size: 1, delay: 1.7 },
  { x: 22, y: 14, size: 1, delay: 0.2 },
  { x: 28, y: 26, size: 1, delay: 1.0 },
  { x: 35, y: 10, size: 1, delay: 0.6 },
  { x: 45, y: 28, size: 1, delay: 1.3 },
  { x: 55, y: 12, size: 1, delay: 0.3 },
  { x: 65, y: 25, size: 1, delay: 0.9 },
  { x: 75, y: 8, size: 1, delay: 1.5 },
  { x: 85, y: 20, size: 1, delay: 0.5 },
  { x: 95, y: 12, size: 1, delay: 1.1 },
  { x: 3, y: 15, size: 1, delay: 0.7 },
  { x: 10, y: 28, size: 1, delay: 1.4 },
  { x: 20, y: 10, size: 1, delay: 0.1 },
  { x: 30, y: 5, size: 1, delay: 0.8 },
  { x: 40, y: 18, size: 1, delay: 1.2 },
  { x: 50, y: 3, size: 1, delay: 0.4 },
  { x: 60, y: 22, size: 1, delay: 1.6 },
  { x: 70, y: 12, size: 1, delay: 0.2 },
  { x: 80, y: 6, size: 1, delay: 0.9 },
  { x: 90, y: 28, size: 1, delay: 1.3 },
  // Small stars (2px)
  { x: 7, y: 8, size: 2, delay: 0.5 },
  { x: 17, y: 20, size: 2, delay: 1.0 },
  { x: 27, y: 12, size: 2, delay: 0.3 },
  { x: 37, y: 6, size: 2, delay: 1.4 },
  { x: 47, y: 22, size: 2, delay: 0.7 },
  { x: 57, y: 5, size: 2, delay: 1.1 },
  { x: 67, y: 18, size: 2, delay: 0.2 },
  { x: 77, y: 10, size: 2, delay: 0.8 },
  { x: 87, y: 15, size: 2, delay: 1.5 },
  { x: 97, y: 8, size: 2, delay: 0.6 },
  { x: 14, y: 25, size: 2, delay: 1.2 },
  { x: 34, y: 16, size: 2, delay: 0.4 },
  { x: 54, y: 26, size: 2, delay: 0.9 },
  { x: 74, y: 22, size: 2, delay: 1.6 },
  { x: 94, y: 4, size: 2, delay: 0.1 },
  // Bright stars (3px with glow)
  { x: 11, y: 10, size: 3, delay: 0, bright: true },
  { x: 33, y: 4, size: 3, delay: 0.6, bright: true },
  { x: 53, y: 16, size: 3, delay: 1.2, bright: true },
  { x: 73, y: 6, size: 3, delay: 0.3, bright: true },
  { x: 93, y: 20, size: 3, delay: 0.9, bright: true },
  { x: 23, y: 22, size: 3, delay: 1.5, bright: true },
  { x: 63, y: 3, size: 3, delay: 0.4, bright: true },
  { x: 83, y: 26, size: 3, delay: 1.0, bright: true },
];

interface SceneBackgroundProps {
  children: React.ReactNode;
}

export function SceneBackground({ children }: SceneBackgroundProps) {
  const [hour, setHour] = useState(() => new Date().getHours());

  // Update hour every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const timeOfDay = useMemo(() => getTimeOfDay(hour), [hour]);
  const isNight = timeOfDay === 'night';
  const isSunset = timeOfDay === 'sunset';

  // Sun/Moon position based on hour (simplified arc)
  // Positioned on the RIGHT side to avoid UI elements on the left
  const celestialPosition = useMemo(() => {
    let progress: number;
    if (hour >= 6 && hour < 20) {
      // Day: sun moves from center-right to right
      progress = (hour - 6) / 14;
    } else {
      // Night: moon moves
      const nightHour = hour >= 20 ? hour - 20 : hour + 4;
      progress = nightHour / 10;
    }
    // Arc motion: x stays on RIGHT side (60% to 90%), y follows parabola
    const x = 60 + progress * 30;
    const y = 12 + Math.sin(progress * Math.PI) * -8; // Higher in middle
    return { x, y };
  }, [hour]);

  return (
    <div className="relative overflow-hidden rounded-card">
      {/* Sky gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${skyGradients[timeOfDay]} transition-all duration-1000`}
      />

      {/* Stars (night only) - CSS positioned divs */}
      {isNight && (
        <div className="absolute inset-0 overflow-hidden">
          {STARS.map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.bright ? 1 : 0.7,
                boxShadow: star.bright ? '0 0 4px 1px rgba(255,255,255,0.6)' : 'none',
                animation: `twinkle ${2 + star.delay}s ease-in-out infinite`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Sun or Moon */}
      <div
        className="absolute transition-all duration-1000"
        style={{
          left: `${celestialPosition.x}%`,
          top: `${celestialPosition.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {isNight ? (
          // Moon - smaller and subtle
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-slate-200 shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
            {/* Moon craters */}
            <div className="absolute top-1.5 left-1 w-1.5 h-1.5 rounded-full bg-slate-300/50" />
            <div className="absolute top-3 left-3 w-1 h-1 rounded-full bg-slate-300/50" />
          </div>
        ) : (
          // Sun - smaller and subtle
          <div
            className={`w-7 h-7 rounded-full transition-colors duration-1000 ${
              isSunset
                ? 'bg-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.5)]'
                : 'bg-yellow-300 shadow-[0_0_20px_rgba(253,224,71,0.4)]'
            }`}
          />
        )}
      </div>

      {/* Ground/Grass */}
      <div className="absolute bottom-0 left-0 right-0 h-10 w-full">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 30"
          preserveAspectRatio="none"
        >
          {/* Back grass layer */}
          <path
            d="M0 30 L0 18 Q20 10 40 16 Q60 8 80 14 Q100 6 120 12 Q140 8 160 14 Q180 10 200 16 L200 30 Z"
            className={`transition-colors duration-1000 ${
              isNight ? 'fill-green-950' : 'fill-green-700'
            }`}
          />
          {/* Front grass layer */}
          <path
            d="M0 30 L0 22 Q25 16 50 20 Q75 14 100 18 Q125 14 150 20 Q175 16 200 20 L200 30 Z"
            className={`transition-colors duration-1000 ${
              isNight ? 'fill-green-900' : 'fill-green-600'
            }`}
          />
          {/* Ground base */}
          <rect
            x="0"
            y="24"
            width="200"
            height="6"
            className={`transition-colors duration-1000 ${
              isNight ? 'fill-green-950' : 'fill-green-800'
            }`}
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
