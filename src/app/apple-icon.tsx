import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const contentType = 'image/png'
export const size = { width: 180, height: 180 }

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          borderRadius: '40px',
        }}
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 100 100"
        >
          {/* Stem */}
          <path
            d="M50 95 Q48 60 50 35"
            stroke="#166534"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Lower leaves */}
          <path d="M50 70 Q30 60 25 70 Q35 82 50 70" fill="#4ade80" />
          <path d="M50 70 Q70 60 75 70 Q65 82 50 70" fill="#4ade80" />

          {/* Upper leaves */}
          <path d="M50 52 Q25 40 18 52 Q30 68 50 52" fill="#4ade80" />
          <path d="M50 52 Q75 40 82 52 Q70 68 50 52" fill="#4ade80" />

          {/* Outer petals */}
          <ellipse cx="50" cy="18" rx="7" ry="16" fill="#fb7185" transform="rotate(0 50 32)" />
          <ellipse cx="50" cy="18" rx="7" ry="16" fill="#fb7185" transform="rotate(45 50 32)" />
          <ellipse cx="50" cy="18" rx="7" ry="16" fill="#fb7185" transform="rotate(90 50 32)" />
          <ellipse cx="50" cy="18" rx="7" ry="16" fill="#fb7185" transform="rotate(135 50 32)" />
          <ellipse cx="50" cy="18" rx="7" ry="16" fill="#fb7185" transform="rotate(180 50 32)" />
          <ellipse cx="50" cy="18" rx="7" ry="16" fill="#fb7185" transform="rotate(225 50 32)" />
          <ellipse cx="50" cy="18" rx="7" ry="16" fill="#fb7185" transform="rotate(270 50 32)" />
          <ellipse cx="50" cy="18" rx="7" ry="16" fill="#fb7185" transform="rotate(315 50 32)" />

          {/* Inner petals */}
          <ellipse cx="50" cy="22" rx="5" ry="11" fill="#fda4af" transform="rotate(22 50 32)" />
          <ellipse cx="50" cy="22" rx="5" ry="11" fill="#fda4af" transform="rotate(67 50 32)" />
          <ellipse cx="50" cy="22" rx="5" ry="11" fill="#fda4af" transform="rotate(112 50 32)" />
          <ellipse cx="50" cy="22" rx="5" ry="11" fill="#fda4af" transform="rotate(157 50 32)" />
          <ellipse cx="50" cy="22" rx="5" ry="11" fill="#fda4af" transform="rotate(202 50 32)" />
          <ellipse cx="50" cy="22" rx="5" ry="11" fill="#fda4af" transform="rotate(247 50 32)" />
          <ellipse cx="50" cy="22" rx="5" ry="11" fill="#fda4af" transform="rotate(292 50 32)" />
          <ellipse cx="50" cy="22" rx="5" ry="11" fill="#fda4af" transform="rotate(337 50 32)" />

          {/* Flower center */}
          <circle cx="50" cy="32" r="10" fill="#fbbf24" />
          <circle cx="50" cy="32" r="6" fill="#f59e0b" />
          <circle cx="47" cy="30" r="2" fill="#fcd34d" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
