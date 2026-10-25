import React from 'react';

interface CountryFlagSvgProps {
  countryId: string;
  className?: string;
  title?: string;
}

/**
 * High-fidelity, self-contained SVG flags for cross-platform visual consistency.
 * Prevents OS/browser missing emoji glyph issues on Windows, Linux, and Android.
 */
export const CountryFlagSvg: React.FC<CountryFlagSvgProps> = ({
  countryId,
  className = 'w-full h-full',
  title,
}) => {
  const cid = countryId.toLowerCase();

  switch (cid) {
    case 'vn': // Vietnam: Red field with yellow star
      return (
        <svg
          viewBox="0 0 900 600"
          className={className}
          role="img"
          aria-label={title || 'Quốc kỳ Việt Nam'}
        >
          <rect width="900" height="600" fill="#DA251D" />
          <polygon
            points="450,135 487,250 608,250 510,321 547,436 450,365 353,436 390,321 292,250 413,250"
            fill="#FFFF00"
          />
        </svg>
      );

    case 'us': // United States: 13 stripes and blue canton
      return (
        <svg
          viewBox="0 0 741 390"
          className={className}
          role="img"
          aria-label={title || 'Quốc kỳ Hoa Kỳ'}
        >
          <rect width="741" height="390" fill="#B22234" />
          {/* 6 white stripes */}
          <rect y="30" width="741" height="30" fill="#FFFFFF" />
          <rect y="90" width="741" height="30" fill="#FFFFFF" />
          <rect y="150" width="741" height="30" fill="#FFFFFF" />
          <rect y="210" width="741" height="30" fill="#FFFFFF" />
          <rect y="270" width="741" height="30" fill="#FFFFFF" />
          <rect y="330" width="741" height="30" fill="#FFFFFF" />
          {/* Blue canton */}
          <rect width="296" height="210" fill="#3C3B6E" />
          {/* Stars grid */}
          <g fill="#FFFFFF">
            {[35, 85, 135, 185, 235].map((x) =>
              [25, 65, 105, 145, 185].map((y) => (
                <circle key={`star-${x}-${y}`} cx={x} cy={y} r="6" />
              ))
            )}
            {[60, 110, 160, 210, 260].map((x) =>
              [45, 85, 125, 165].map((y) => (
                <circle key={`star2-${x}-${y}`} cx={x} cy={y} r="5" />
              ))
            )}
          </g>
        </svg>
      );

    case 'gb': // United Kingdom: Union Jack
      return (
        <svg
          viewBox="0 0 600 300"
          className={className}
          role="img"
          aria-label={title || 'Quốc kỳ Vương Quốc Anh'}
        >
          <clipPath id="gb-clip">
            <rect width="600" height="300" />
          </clipPath>
          <g clipPath="url(#gb-clip)">
            <rect width="600" height="300" fill="#012169" />
            {/* White diagonal saltire */}
            <path d="M0,0 L600,300 M600,0 L0,300" stroke="#FFFFFF" strokeWidth="60" />
            {/* Red diagonal saltire */}
            <path d="M0,0 L600,300 M600,0 L0,300" stroke="#C8102E" strokeWidth="20" />
            {/* White cross */}
            <path d="M300,0 V300 M0,150 H600" stroke="#FFFFFF" strokeWidth="100" />
            {/* Red cross */}
            <path d="M300,0 V300 M0,150 H600" stroke="#C8102E" strokeWidth="60" />
          </g>
        </svg>
      );

    case 'jp': // Japan: Hinomaru
      return (
        <svg
          viewBox="0 0 900 600"
          className={className}
          role="img"
          aria-label={title || 'Quốc kỳ Nhật Bản'}
        >
          <rect width="900" height="600" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="450" cy="300" r="180" fill="#BC002D" />
        </svg>
      );

    case 'kr': // South Korea: Taegeukgi
      return (
        <svg
          viewBox="0 0 900 600"
          className={className}
          role="img"
          aria-label={title || 'Quốc kỳ Hàn Quốc'}
        >
          <rect width="900" height="600" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          {/* Central Taegeuk circle */}
          <g transform="translate(450,300) rotate(-33.7)">
            <path d="M-150,0 A150,150 0 0,1 150,0 A75,75 0 0,1 0,0 A75,75 0 0,0 -150,0 Z" fill="#CD2E3A" />
            <path d="M-150,0 A150,150 0 0,0 150,0 A75,75 0 0,0 0,0 A75,75 0 0,1 -150,0 Z" fill="#0047A0" />
          </g>
          {/* Trigrams simplified accents */}
          <g fill="#000000">
            {/* Top-left */}
            <rect x="220" y="140" width="60" height="10" transform="rotate(-33 250 145)" />
            <rect x="230" y="160" width="60" height="10" transform="rotate(-33 260 165)" />
            <rect x="240" y="180" width="60" height="10" transform="rotate(-33 270 185)" />
            {/* Bottom-right */}
            <rect x="620" y="420" width="60" height="10" transform="rotate(-33 650 425)" />
            <rect x="630" y="440" width="60" height="10" transform="rotate(-33 660 445)" />
            <rect x="640" y="460" width="60" height="10" transform="rotate(-33 670 465)" />
          </g>
        </svg>
      );

    case 'fr': // France: Blue White Red vertical
      return (
        <svg
          viewBox="0 0 900 600"
          className={className}
          role="img"
          aria-label={title || 'Quốc kỳ Nước Pháp'}
        >
          <rect width="300" height="600" fill="#002654" />
          <rect x="300" width="300" height="600" fill="#FFFFFF" />
          <rect x="600" width="300" height="600" fill="#ED2939" />
        </svg>
      );

    case 'de': // Germany: Black Red Gold horizontal
      return (
        <svg
          viewBox="0 0 900 600"
          className={className}
          role="img"
          aria-label={title || 'Quốc kỳ Nước Đức'}
        >
          <rect width="900" height="200" fill="#000000" />
          <rect y="200" width="900" height="200" fill="#DD0000" />
          <rect y="400" width="900" height="200" fill="#FFCE00" />
        </svg>
      );

    case 'it': // Italy: Green White Red vertical
      return (
        <svg
          viewBox="0 0 900 600"
          className={className}
          role="img"
          aria-label={title || 'Quốc kỳ Nước Ý'}
        >
          <rect width="300" height="600" fill="#009246" />
          <rect x="300" width="300" height="600" fill="#FFFFFF" />
          <rect x="600" width="300" height="600" fill="#CE2B37" />
        </svg>
      );

    case 'ca': // Canada: Red White Red with maple leaf
      return (
        <svg
          viewBox="0 0 1000 500"
          className={className}
          role="img"
          aria-label={title || 'Quốc kỳ Canada'}
        >
          <rect width="250" height="500" fill="#FF0000" />
          <rect x="250" width="500" height="500" fill="#FFFFFF" />
          <rect x="750" width="250" height="500" fill="#FF0000" />
          {/* Maple Leaf */}
          <path
            d="M500,100 L520,200 L560,180 L540,240 L590,250 L570,290 L610,310 L560,330 L570,360 L515,350 L508,420 L492,420 L485,350 L430,360 L440,330 L390,310 L430,290 L410,250 L460,240 L440,180 L480,200 Z"
            fill="#FF0000"
          />
        </svg>
      );

    case 'au': // Australia: Blue Ensign with Southern Cross
      return (
        <svg
          viewBox="0 0 1200 600"
          className={className}
          role="img"
          aria-label={title || 'Quốc kỳ Nước Úc'}
        >
          <rect width="1200" height="600" fill="#00008B" />
          {/* Union Jack in Canton */}
          <g transform="scale(0.5)">
            <rect width="600" height="300" fill="#012169" />
            <path d="M0,0 L600,300 M600,0 L0,300" stroke="#FFFFFF" strokeWidth="60" />
            <path d="M0,0 L600,300 M600,0 L0,300" stroke="#C8102E" strokeWidth="20" />
            <path d="M300,0 V300 M0,150 H600" stroke="#FFFFFF" strokeWidth="100" />
            <path d="M300,0 V300 M0,150 H600" stroke="#C8102E" strokeWidth="60" />
          </g>
          {/* Commonwealth Star */}
          <circle cx="300" cy="450" r="45" fill="#FFFFFF" />
          {/* Southern cross stars */}
          <circle cx="900" cy="150" r="20" fill="#FFFFFF" />
          <circle cx="1020" cy="240" r="20" fill="#FFFFFF" />
          <circle cx="900" cy="450" r="20" fill="#FFFFFF" />
          <circle cx="780" cy="270" r="20" fill="#FFFFFF" />
          <circle cx="960" cy="330" r="14" fill="#FFFFFF" />
        </svg>
      );

    case 'sg': // Singapore: Red / White with crescent & 5 stars
      return (
        <svg
          viewBox="0 0 900 600"
          className={className}
          role="img"
          aria-label={title || 'Quốc kỳ Singapore'}
        >
          <rect width="900" height="300" fill="#ED2939" />
          <rect y="300" width="900" height="300" fill="#FFFFFF" />
          {/* Crescent */}
          <path
            d="M 180 70 A 80 80 0 1 0 180 230 A 70 70 0 1 1 180 70 Z"
            fill="#FFFFFF"
          />
          {/* 5 small stars */}
          <g fill="#FFFFFF">
            <circle cx="215" cy="115" r="9" />
            <circle cx="245" cy="130" r="9" />
            <circle cx="240" cy="170" r="9" />
            <circle cx="205" cy="180" r="9" />
            <circle cx="190" cy="145" r="9" />
          </g>
        </svg>
      );

    case 'br': // Brazil: Green field, yellow rhombus, blue circle
      return (
        <svg
          viewBox="0 0 1000 700"
          className={className}
          role="img"
          aria-label={title || 'Quốc kỳ Brazil'}
        >
          <rect width="1000" height="700" fill="#009B3A" />
          <polygon points="500,85 915,350 500,615 85,350" fill="#FEDF00" />
          <circle cx="500" cy="350" r="175" fill="#002776" />
          {/* White celestial band */}
          <path
            d="M 330 365 C 440 310, 560 310, 670 375"
            stroke="#FFFFFF"
            strokeWidth="18"
            fill="none"
          />
        </svg>
      );

    case 'cn': // China: Red field with 5 yellow stars
      return (
        <svg
          viewBox="0 0 900 600"
          className={className}
          role="img"
          aria-label={title || 'Quốc kỳ Trung Quốc'}
        >
          <rect width="900" height="600" fill="#EE1C25" />
          {/* Main Star */}
          <polygon
            points="150,75 168,131 227,131 179,166 197,222 150,187 103,222 121,166 73,131 132,131"
            fill="#FFFF00"
          />
          {/* 4 smaller stars */}
          <circle cx="300" cy="60" r="14" fill="#FFFF00" />
          <circle cx="360" cy="120" r="14" fill="#FFFF00" />
          <circle cx="360" cy="210" r="14" fill="#FFFF00" />
          <circle cx="300" cy="270" r="14" fill="#FFFF00" />
        </svg>
      );

    case 'es': // Spain: Red / Yellow / Red
      return (
        <svg
          viewBox="0 0 900 600"
          className={className}
          role="img"
          aria-label={title || 'Quốc kỳ Tây Ban Nha'}
        >
          <rect width="900" height="150" fill="#AA151B" />
          <rect y="150" width="900" height="300" fill="#F1BF00" />
          <rect y="450" width="900" height="150" fill="#AA151B" />
          {/* Coat of arms emblem placeholder */}
          <circle cx="280" cy="300" r="45" fill="#AA151B" />
          <circle cx="280" cy="300" r="35" fill="#FFFFFF" />
        </svg>
      );

    case 'th': // Thailand: Red White Blue White Red
      return (
        <svg
          viewBox="0 0 900 600"
          className={className}
          role="img"
          aria-label={title || 'Quốc kỳ Thái Lan'}
        >
          <rect width="900" height="100" fill="#A51931" />
          <rect y="100" width="900" height="100" fill="#F4F5F8" />
          <rect y="200" width="900" height="200" fill="#2D2A4A" />
          <rect y="400" width="900" height="100" fill="#F4F5F8" />
          <rect y="500" width="900" height="100" fill="#A51931" />
        </svg>
      );

    case 'ch': // Switzerland: Red with white cross
      return (
        <svg
          viewBox="0 0 600 600"
          className={className}
          role="img"
          aria-label={title || 'Quốc kỳ Thụy Sĩ'}
        >
          <rect width="600" height="600" fill="#D52B1E" />
          <rect x="250" y="120" width="100" height="360" fill="#FFFFFF" rx="6" />
          <rect x="120" y="250" width="360" height="100" fill="#FFFFFF" rx="6" />
        </svg>
      );

    default:
      return (
        <div className="w-full h-full flex items-center justify-center bg-sky-100 rounded-lg text-2xl font-black text-sky-800">
          🚩
        </div>
      );
  }
};
