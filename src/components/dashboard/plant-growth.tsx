'use client';

import { useMemo, useState, useEffect, useRef } from 'react';

interface PlantGrowthProps {
  percentage: number;
  size?: number;
}

type GrowthStage = 'seed' | 'sprout' | 'seedling' | 'growing' | 'blooming' | 'flower';

function getGrowthStage(percentage: number): GrowthStage {
  if (percentage === 0) return 'seed';
  if (percentage < 25) return 'sprout';
  if (percentage < 50) return 'seedling';
  if (percentage < 75) return 'growing';
  if (percentage < 100) return 'blooming';
  return 'flower';
}

// Particle component for growth celebration
function Particle({ delay }: { delay: number }) {
  return (
    <div
      className="absolute w-2 h-2 rounded-full bg-yellow-400 animate-float-up"
      style={{
        left: `${30 + Math.random() * 40}%`,
        bottom: '40%',
        animationDelay: `${delay}ms`,
      }}
    />
  );
}

export function PlantGrowth({ percentage, size = 120 }: PlantGrowthProps) {
  const stage = useMemo(() => getGrowthStage(percentage), [percentage]);
  const isComplete = percentage === 100;
  const prevPercentageRef = useRef(percentage);
  const [showParticles, setShowParticles] = useState(false);
  const [isGrowing, setIsGrowing] = useState(false);

  // Detect growth and trigger animations
  useEffect(() => {
    if (percentage > prevPercentageRef.current) {
      setIsGrowing(true);
      setShowParticles(true);

      const growTimer = setTimeout(() => setIsGrowing(false), 500);
      const particleTimer = setTimeout(() => setShowParticles(false), 1000);

      return () => {
        clearTimeout(growTimer);
        clearTimeout(particleTimer);
      };
    }
    prevPercentageRef.current = percentage;
  }, [percentage]);

  // Calculate visibility for each layer
  const sproutOpacity = percentage >= 1 ? 1 : 0;
  const stemHeight = Math.min(percentage / 100, 1);
  const leavesOpacity = percentage >= 25 ? Math.min((percentage - 25) / 25, 1) : 0;
  const moreLeavesOpacity = percentage >= 50 ? Math.min((percentage - 50) / 25, 1) : 0;
  const budOpacity = percentage >= 75 ? Math.min((percentage - 75) / 25, 1) : 0;
  const flowerOpacity = percentage === 100 ? 1 : 0;

  return (
    <div
      className={`relative flex items-end justify-center ${isComplete ? 'animate-glow-pulse' : ''}`}
      style={{ width: size, height: size }}
      aria-label={`Planta de progresso: ${percentage}% - ${stage}`}
    >
      {/* Growth particles */}
      {showParticles && (
        <>
          <Particle delay={0} />
          <Particle delay={100} />
          <Particle delay={200} />
          <Particle delay={300} />
        </>
      )}

      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={`overflow-visible ${isGrowing ? 'animate-grow-bounce' : ''}`}
      >
        <defs>
          {/* Stem gradient */}
          <linearGradient id="stemGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          {/* Leaf gradient */}
          <linearGradient id="leafGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>

          {/* Petal gradient */}
          <radialGradient id="petalGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="100%" stopColor="#e11d48" />
          </radialGradient>

          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Seed in ground (0%) */}
        {percentage === 0 && (
          <g className="animate-pulse">
            {/* Dirt mound */}
            <ellipse cx="50" cy="92" rx="15" ry="5" fill="#78350f" />
            <ellipse cx="50" cy="90" rx="12" ry="4" fill="#92400e" />
            {/* Seed */}
            <ellipse cx="50" cy="88" rx="5" ry="4" fill="#a16207">
              <animate attributeName="cy" values="88;87;88" dur="2s" repeatCount="indefinite" />
            </ellipse>
          </g>
        )}

        {/* Main stem with curve */}
        {percentage > 0 && (
          <g className="animate-sway">
            {/* Stem shadow */}
            <path
              d={`M52 95 Q50 ${95 - 55 * stemHeight} 52 ${95 - 60 * stemHeight}`}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              style={{ opacity: sproutOpacity }}
            />
            {/* Main stem */}
            <path
              d={`M50 95 Q48 ${95 - 55 * stemHeight} 50 ${95 - 60 * stemHeight}`}
              stroke="url(#stemGradient)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              style={{ opacity: sproutOpacity }}
            />
          </g>
        )}

        {/* First pair of leaves (25%+) */}
        <g
          className={`transition-all duration-700 ease-out ${leavesOpacity > 0 ? 'animate-sway' : ''}`}
          style={{
            opacity: leavesOpacity,
            transform: `scale(${0.5 + leavesOpacity * 0.5})`,
            transformOrigin: '50px 65px'
          }}
        >
          {/* Left leaf with detail */}
          <g>
            <path
              d="M50 65 Q30 55 22 65 Q30 78 50 65"
              fill="url(#leafGradient)"
              filter="url(#glow)"
            />
            {/* Leaf vein */}
            <path
              d="M50 65 Q38 62 30 65"
              stroke="#15803d"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
          </g>
          {/* Right leaf with detail */}
          <g>
            <path
              d="M50 65 Q70 55 78 65 Q70 78 50 65"
              fill="url(#leafGradient)"
              filter="url(#glow)"
            />
            {/* Leaf vein */}
            <path
              d="M50 65 Q62 62 70 65"
              stroke="#15803d"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
          </g>
        </g>

        {/* Second pair of leaves (50%+) */}
        <g
          className={`transition-all duration-700 ease-out ${moreLeavesOpacity > 0 ? 'animate-sway' : ''}`}
          style={{
            opacity: moreLeavesOpacity,
            transform: `scale(${0.5 + moreLeavesOpacity * 0.5})`,
            transformOrigin: '50px 48px',
            animationDelay: '0.5s'
          }}
        >
          {/* Upper left leaf - larger */}
          <g>
            <path
              d="M50 48 Q25 35 15 48 Q25 64 50 48"
              fill="url(#leafGradient)"
              filter="url(#glow)"
            />
            <path
              d="M50 48 Q35 44 25 48"
              stroke="#15803d"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
          </g>
          {/* Upper right leaf - larger */}
          <g>
            <path
              d="M50 48 Q75 35 85 48 Q75 64 50 48"
              fill="url(#leafGradient)"
              filter="url(#glow)"
            />
            <path
              d="M50 48 Q65 44 75 48"
              stroke="#15803d"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
          </g>
        </g>

        {/* Flower bud (75%+) */}
        <g
          className="transition-all duration-700 ease-out"
          style={{
            opacity: budOpacity,
            transform: `scale(${0.5 + budOpacity * 0.5})`,
            transformOrigin: '50px 32px'
          }}
        >
          <ellipse cx="50" cy="32" rx="8" ry="12" fill="#fb7185" filter="url(#glow)">
            <animate attributeName="ry" values="12;13;12" dur="2s" repeatCount="indefinite" />
          </ellipse>
          {/* Bud sepals */}
          <path d="M42 38 Q46 32 50 35" fill="#16a34a" />
          <path d="M58 38 Q54 32 50 35" fill="#16a34a" />
        </g>

        {/* Full flower (100%) */}
        <g
          className={`transition-all duration-700 ease-out ${isComplete ? 'animate-celebration' : ''}`}
          style={{
            opacity: flowerOpacity,
            transform: `scale(${flowerOpacity})`,
            transformOrigin: '50px 28px'
          }}
        >
          {/* Outer petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse
              key={`outer-${i}`}
              cx="50"
              cy="18"
              rx="6"
              ry="14"
              fill="url(#petalGradient)"
              filter="url(#glow)"
              style={{
                transformOrigin: '50px 30px',
                transform: `rotate(${angle}deg)`,
              }}
            />
          ))}
          {/* Inner petals */}
          {[22, 67, 112, 157, 202, 247, 292, 337].map((angle, i) => (
            <ellipse
              key={`inner-${i}`}
              cx="50"
              cy="22"
              rx="4"
              ry="10"
              fill="#fda4af"
              style={{
                transformOrigin: '50px 30px',
                transform: `rotate(${angle}deg)`,
              }}
            />
          ))}
          {/* Flower center */}
          <circle cx="50" cy="30" r="8" fill="#fbbf24" filter="url(#glow)">
            <animate attributeName="r" values="8;9;8" dur="1.5s" repeatCount="indefinite" />
          </circle>
          {/* Center detail */}
          <circle cx="50" cy="30" r="5" fill="#f59e0b" />
          <circle cx="48" cy="28" r="1.5" fill="#fbbf24" opacity="0.8" />
          <circle cx="52" cy="32" r="1" fill="#fbbf24" opacity="0.8" />
        </g>

        {/* Sparkles for 100% */}
        {isComplete && (
          <g>
            {[
              { cx: 20, cy: 20, r: 3, delay: 0 },
              { cx: 80, cy: 15, r: 2.5, delay: 0.3 },
              { cx: 15, cy: 50, r: 2, delay: 0.6 },
              { cx: 85, cy: 45, r: 3, delay: 0.9 },
              { cx: 30, cy: 75, r: 2, delay: 0.4 },
              { cx: 70, cy: 70, r: 2.5, delay: 0.7 },
            ].map((spark, i) => (
              <circle
                key={i}
                cx={spark.cx}
                cy={spark.cy}
                r={spark.r}
                fill="#fbbf24"
                filter="url(#glow)"
              >
                <animate
                  attributeName="opacity"
                  values="0.3;1;0.3"
                  dur="1.5s"
                  repeatCount="indefinite"
                  begin={`${spark.delay}s`}
                />
                <animate
                  attributeName="r"
                  values={`${spark.r};${spark.r * 1.5};${spark.r}`}
                  dur="1.5s"
                  repeatCount="indefinite"
                  begin={`${spark.delay}s`}
                />
              </circle>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
