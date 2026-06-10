"use client";

interface FifaTrophyProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

export function FifaTrophy({ size = 200, animate = true, className = "" }: FifaTrophyProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={animate ? { animation: "trophyPulse 2.5s ease-in-out infinite" } : undefined}
    >
      <defs>
        <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#FFE566" />
          <stop offset="30%"  stopColor="#EF9F27" />
          <stop offset="70%"  stopColor="#B8860B" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
        <linearGradient id="trophyShine" x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%"   stopColor="#FFFDE0" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#EF9F27" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="baseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#EF9F27" />
          <stop offset="100%" stopColor="#7a5500" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base plate */}
      <rect x="55" y="210" width="90" height="14" rx="4" fill="url(#baseGrad)" />
      <rect x="60" y="207" width="80" height="6" rx="3" fill="url(#trophyGold)" />

      {/* Stem */}
      <path d="M85 170 L85 207 L115 207 L115 170 Z" fill="url(#trophyGold)" />
      <path d="M87 172 L87 205 L95 205 L95 172 Z" fill="url(#trophyShine)" opacity="0.4" />

      {/* Stem flare top */}
      <path d="M72 160 Q100 155 128 160 L115 172 L85 172 Z" fill="url(#trophyGold)" />

      {/* Cup body */}
      <path
        d="M60 60 Q52 90 55 120 Q58 148 72 160 Q100 168 128 160 Q142 148 145 120 Q148 90 140 60 Z"
        fill="url(#trophyGold)"
        filter="url(#glow)"
      />

      {/* Cup highlight / shine */}
      <path
        d="M68 65 Q62 90 64 115 Q66 135 74 148 Q90 158 100 158"
        stroke="url(#trophyShine)"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />

      {/* Cup inner shadow */}
      <path
        d="M120 65 Q130 90 128 120 Q126 142 116 154"
        stroke="#7a5500"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />

      {/* Left handle */}
      <path
        d="M60 80 Q30 80 28 105 Q26 130 55 130"
        stroke="url(#trophyGold)"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M60 80 Q30 80 28 105 Q26 130 55 130"
        stroke="url(#trophyShine)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />

      {/* Right handle */}
      <path
        d="M140 80 Q170 80 172 105 Q174 130 145 130"
        stroke="url(#trophyGold)"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M140 80 Q170 80 172 105 Q174 130 145 130"
        stroke="url(#trophyShine)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />

      {/* Globe on top */}
      <circle cx="100" cy="48" r="28" fill="url(#trophyGold)" filter="url(#glow)" />
      <circle cx="100" cy="48" r="28" fill="none" stroke="#B8860B" strokeWidth="1.5" />

      {/* Globe continents / texture */}
      <ellipse cx="100" cy="48" rx="18" ry="28" fill="none" stroke="#B8860B" strokeWidth="1" opacity="0.5" />
      <line x1="72" y1="48" x2="128" y2="48" stroke="#B8860B" strokeWidth="1" opacity="0.5" />
      <ellipse cx="100" cy="48" rx="28" ry="14" fill="none" stroke="#B8860B" strokeWidth="1" opacity="0.4" />

      {/* Globe shine */}
      <ellipse cx="90" cy="36" rx="10" ry="7" fill="white" opacity="0.25" />

      {/* FIFA text on cup */}
      <text
        x="100" y="125"
        textAnchor="middle"
        fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900"
        fontSize="22"
        fill="#7a5500"
        opacity="0.6"
        letterSpacing="2"
      >FIFA</text>

      {/* Stars above */}
      {[-24, -8, 8, 24].map((ox, i) => (
        <g key={i} transform={`translate(${100 + ox}, 14)`}>
          <polygon
            points="0,-5 1.5,-1.5 5,-1.5 2.5,1 3.5,5 0,2.5 -3.5,5 -2.5,1 -5,-1.5 -1.5,-1.5"
            fill="#FFD700"
            filter="url(#glow)"
          />
        </g>
      ))}
    </svg>
  );
}
