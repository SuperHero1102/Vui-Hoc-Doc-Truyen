import React from 'react';

interface PastelIllustrationProps {
  wordId: string;
  emoji: string;
  colorHex: string;
  bgTint: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const COLOR_SWATCH_MAP: Record<string, { fill: string; stroke: string; label: string }> = {
  red: { fill: '#EF4444', stroke: '#991B1B', label: 'RED' },
  yellow: { fill: '#FACC15', stroke: '#A16207', label: 'YELLOW' },
  blue: { fill: '#0284C7', stroke: '#075985', label: 'BLUE' },
  green: { fill: '#10B981', stroke: '#065F46', label: 'GREEN' },
  pink: { fill: '#EC4899', stroke: '#9D174D', label: 'PINK' },
  'orange-color': { fill: '#F97316', stroke: '#9A3412', label: 'ORANGE' },
  purple: { fill: '#8B5CF6', stroke: '#5B21B6', label: 'PURPLE' },
  white: { fill: '#FFFFFF', stroke: '#64748B', label: 'WHITE' },
};

/**
 * Renders unified rounded pastel vector art + expressive character illustrations
 * so every vocabulary card and game target has a cohesive, zero-broken-image visual.
 */
export const PastelIllustration: React.FC<PastelIllustrationProps> = ({
  wordId,
  emoji,
  colorHex,
  bgTint,
  size = 'lg',
}) => {
  const dimensions =
    size === 'sm'
      ? 'w-14 h-14 text-3xl'
      : size === 'md'
        ? 'w-20 h-20 text-4xl'
        : size === 'lg'
          ? 'w-28 h-28 text-6xl'
          : 'w-36 h-36 text-7xl';

  const renderCustomSvg = () => {
    if (COLOR_SWATCH_MAP[wordId]) {
      const swatch = COLOR_SWATCH_MAP[wordId];
      return (
        <svg viewBox="0 0 120 120" className="w-4/5 h-4/5">
          <path
            d="M60 16 C86 16, 104 34, 104 60 C104 86, 86 104, 60 104 C34 104, 16 86, 16 60 C16 34, 34 16, 60 16 Z"
            fill={swatch.fill}
            stroke={swatch.stroke}
            strokeWidth="6"
          />
          <ellipse cx="45" cy="40" rx="12" ry="7" fill="#FFFFFF" opacity="0.65" transform="rotate(-25 45 40)" />
          <circle cx="46" cy="62" r="5" fill={wordId === 'white' ? '#1E293B' : '#FFFFFF'} />
          <circle cx="74" cy="62" r="5" fill={wordId === 'white' ? '#1E293B' : '#FFFFFF'} />
          <path
            d="M48 74 Q60 84 72 74"
            stroke={wordId === 'white' ? '#1E293B' : '#FFFFFF'}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    switch (wordId) {
      case 'cow':
        return (
          <svg viewBox="0 0 120 120" className="w-4/5 h-4/5">
            <circle cx="60" cy="64" r="40" fill="#FFFFFF" stroke="#1E293B" strokeWidth="4" />
            <path d="M36 42 C24 30, 18 48, 32 54" fill="#FDE68A" stroke="#1E293B" strokeWidth="4" />
            <path d="M84 42 C96 30, 102 48, 88 54" fill="#FDE68A" stroke="#1E293B" strokeWidth="4" />
            <ellipse cx="44" cy="52" rx="10" ry="8" fill="#334155" />
            <ellipse cx="78" cy="66" rx="9" ry="12" fill="#334155" />
            <ellipse cx="60" cy="76" rx="24" ry="16" fill="#FBCFE8" stroke="#1E293B" strokeWidth="3.5" />
            <circle cx="46" cy="56" r="5" fill="#0F172A" />
            <circle cx="74" cy="56" r="5" fill="#0F172A" />
            <circle cx="52" cy="75" r="3" fill="#9D174D" />
            <circle cx="68" cy="75" r="3" fill="#9D174D" />
          </svg>
        );
      case 'cat':
        return (
          <svg viewBox="0 0 120 120" className="w-4/5 h-4/5">
            <polygon points="28,52 34,20 56,38" fill="#FDBA74" stroke="#1E293B" strokeWidth="4" strokeLinejoin="round" />
            <polygon points="92,52 86,20 64,38" fill="#FDBA74" stroke="#1E293B" strokeWidth="4" strokeLinejoin="round" />
            <circle cx="60" cy="66" r="38" fill="#FFEDD5" stroke="#1E293B" strokeWidth="4" />
            <circle cx="46" cy="60" r="5.5" fill="#0F172A" />
            <circle cx="74" cy="60" r="5.5" fill="#0F172A" />
            <polygon points="55,68 65,68 60,74" fill="#FB7185" />
            <line x1="20" y1="66" x2="36" y2="68" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <line x1="20" y1="74" x2="36" y2="74" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <line x1="100" y1="66" x2="84" y2="68" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <line x1="100" y1="74" x2="84" y2="74" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
      case 'apple':
        return (
          <svg viewBox="0 0 120 120" className="w-4/5 h-4/5">
            <path d="M60 28 C62 16, 70 14, 72 14" stroke="#78350F" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M62 24 C76 14, 88 24, 72 32 Z" fill="#4ADE80" stroke="#166534" strokeWidth="3" />
            <path d="M60 32 C36 26, 20 48, 26 76 C32 98, 50 104, 60 96 C70 104, 88 98, 94 76 C100 48, 84 26, 60 32 Z" fill="#F87171" stroke="#991B1B" strokeWidth="4" />
            <circle cx="46" cy="64" r="5" fill="#0F172A" />
            <circle cx="74" cy="64" r="5" fill="#0F172A" />
            <path d="M52 74 Q60 82 68 74" stroke="#0F172A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <ellipse cx="38" cy="70" rx="5" ry="3" fill="#FECDD3" />
            <ellipse cx="82" cy="70" rx="5" ry="3" fill="#FECDD3" />
          </svg>
        );
      case 'vocab-school-3': // Eraser
        return (
          <svg viewBox="0 0 120 120" className="w-4/5 h-4/5">
            <rect x="20" y="38" width="52" height="44" rx="10" fill="#38BDF8" stroke="#0284C7" strokeWidth="4" />
            <rect x="58" y="38" width="42" height="44" rx="10" fill="#F472B6" stroke="#DB2777" strokeWidth="4" />
            <line x1="58" y1="38" x2="58" y2="82" stroke="#1E293B" strokeWidth="3" />
          </svg>
        );
      default:
        return null;
    }
  };

  const customSvg = renderCustomSvg();

  return (
    <div
      className={`${dimensions} rounded-3xl flex items-center justify-center relative select-none shrink-0 shadow-inner`}
      style={{
        backgroundColor: bgTint,
        border: `3px solid ${colorHex}40`,
      }}
    >
      <div
        className="w-3 h-3 rounded-full absolute top-2.5 right-3 opacity-60"
        style={{ backgroundColor: colorHex }}
      />
      {customSvg || (
        <span className="leading-none filter drop-shadow-sm" role="img" aria-hidden="true">
          {emoji}
        </span>
      )}
    </div>
  );
};
