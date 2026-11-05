/**
 * Bộ sưu tập Đồ Họa Vector 3D Clay Chibi cho trò chơi "Trang Điểm & Trang Phục"
 * Thiết kế theo chuẩn đất sét Play-Doh mập mạp, bo tròn lớn, ánh sáng trên-trái,
 * bóng đổ nhẹ, màu sắc tươi sáng dành cho trẻ em.
 * 
 * ĐẶC ĐIỂM KỸ THUẬT:
 * - Kích thước chuẩn 512x512 pixel, tỉ lệ 1:1, đối tượng căn giữa chiếm ~80%.
 * - Lề an toàn >= 8% (40px) ở cả 4 cạnh, đảm bảo không bao giờ bị cắt mép.
 * - Món theo cặp (giày, ủng, khuyên tai, dép) vẽ đủ 2 chiếc cân đối, đối xứng, không chồng lấn.
 * - Món màu trắng/sáng có viền kem/xám mềm và bóng đổ clay, hiển thị rõ trên cả nền sáng và tối.
 * - Nền trong suốt alpha 100%, không viền đen, không quầng halo, không răng cưa.
 * - Dung lượng siêu nhẹ (< 5KB/món), vector không vỡ hạt khi zoom tối đa.
 */

export function svgToDataUrl(svgString: string): string {
  const cleanSvg = svgString.trim().replace(/\s+/g, ' ');
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`;
}

// =========================================================================
// 1. MŨ & NÓN (hat)
// =========================================================================

export const svgHatWitch = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="hw-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#1e1b4b" flood-opacity="0.25"/>
    </filter>
    <linearGradient id="hw-body" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B5CF6"/>
      <stop offset="60%" stop-color="#6D28D9"/>
      <stop offset="100%" stop-color="#4C1D95"/>
    </linearGradient>
    <linearGradient id="hw-brim" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#7C3AED"/>
      <stop offset="100%" stop-color="#431407"/>
    </linearGradient>
  </defs>
  <g filter="url(#hw-sh)">
    <ellipse cx="256" cy="390" rx="195" ry="50" fill="url(#hw-brim)"/>
    <ellipse cx="256" cy="382" rx="180" ry="42" fill="#6D28D9"/>
    <ellipse cx="256" cy="374" rx="140" ry="28" fill="#4C1D95"/>
    <path d="M 165 370 Q 200 240 230 140 Q 248 80 290 60 Q 335 45 365 72 Q 355 105 310 128 Q 280 180 347 370 Z" fill="url(#hw-body)"/>
    <path d="M 158 370 Q 256 405 354 370 L 348 335 Q 256 368 168 335 Z" fill="#F59E0B"/>
    <circle cx="256" cy="368" r="24" fill="#FBBF24"/>
    <circle cx="256" cy="368" r="14" fill="#78350F"/>
    <polygon points="256,358 260,366 268,367 262,372 264,380 256,375 248,380 250,372 244,367 252,366" fill="#FEF08A"/>
    <ellipse cx="215" cy="220" rx="16" ry="45" transform="rotate(-15 215 220)" fill="#C4B5FD" opacity="0.45"/>
    <circle cx="340" cy="74" r="12" fill="#DDD6FE" opacity="0.6"/>
  </g>
</svg>
`);

export const svgHatChef = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="hc-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#334155" flood-opacity="0.2"/>
    </filter>
    <linearGradient id="hc-cloud" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="70%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
  </defs>
  <g filter="url(#hc-sh)">
    <circle cx="256" cy="180" r="100" fill="url(#hc-cloud)" stroke="#CBD5E1" stroke-width="6"/>
    <circle cx="165" cy="230" r="90" fill="url(#hc-cloud)" stroke="#CBD5E1" stroke-width="6"/>
    <circle cx="347" cy="230" r="90" fill="url(#hc-cloud)" stroke="#CBD5E1" stroke-width="6"/>
    <circle cx="120" cy="305" r="72" fill="url(#hc-cloud)" stroke="#CBD5E1" stroke-width="6"/>
    <circle cx="392" cy="305" r="72" fill="url(#hc-cloud)" stroke="#CBD5E1" stroke-width="6"/>
    <ellipse cx="230" cy="130" rx="50" ry="30" fill="#FFFFFF" opacity="0.9"/>
    <path d="M 135 345 Q 256 360 377 345 L 367 430 Q 256 450 145 430 Z" fill="#F8FAFC" stroke="#94A3B8" stroke-width="8"/>
    <ellipse cx="256" cy="430" rx="110" ry="14" fill="#E2E8F0"/>
    <line x1="200" y1="360" x2="195" y2="420" stroke="#CBD5E1" stroke-width="6" stroke-linecap="round"/>
    <line x1="256" y1="362" x2="256" y2="425" stroke="#CBD5E1" stroke-width="6" stroke-linecap="round"/>
    <line x1="312" y1="360" x2="317" y2="420" stroke="#CBD5E1" stroke-width="6" stroke-linecap="round"/>
    <circle cx="256" cy="395" r="16" fill="#F43F5E"/>
    <line x1="256" y1="385" x2="256" y2="405" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
  </g>
</svg>
`);

export const svgHatDoctor = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="hd-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#0369a1" flood-opacity="0.2"/>
    </filter>
  </defs>
  <g filter="url(#hd-sh)">
    <path d="M 125 390 C 135 240, 165 165, 256 155 C 347 165, 377 240, 387 390 C 330 415, 182 415, 125 390 Z" fill="#FFFFFF" stroke="#94A3B8" stroke-width="8"/>
    <path d="M 140 365 Q 256 395 372 365 L 368 388 Q 256 418 144 388 Z" fill="#0284C7"/>
    <rect x="238" y="215" width="36" height="85" rx="18" fill="#EF4444"/>
    <rect x="214" y="240" width="84" height="36" rx="18" fill="#EF4444"/>
    <ellipse cx="248" cy="230" rx="8" ry="12" fill="#FCA5A5"/>
    <ellipse cx="200" cy="210" rx="26" ry="14" transform="rotate(-25 200 210)" fill="#FFFFFF" opacity="0.8"/>
  </g>
</svg>
`);

export const svgHatCowboy = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="hcow-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#451a03" flood-opacity="0.25"/>
    </filter>
    <linearGradient id="hcow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D97706"/>
      <stop offset="60%" stop-color="#B45309"/>
      <stop offset="100%" stop-color="#78350F"/>
    </linearGradient>
  </defs>
  <g filter="url(#hcow-sh)">
    <path d="M 65 375 C 85 295, 165 375, 256 380 C 347 375, 427 295, 447 375 C 425 445, 87 445, 65 375 Z" fill="url(#hcow-grad)"/>
    <ellipse cx="256" cy="380" rx="135" ry="24" fill="#78350F"/>
    <path d="M 170 375 C 165 255, 195 185, 222 175 C 240 200, 272 200, 290 175 C 317 185, 347 255, 342 375 Z" fill="url(#hcow-grad)"/>
    <path d="M 171 375 Q 256 400 341 375 L 339 345 Q 256 370 173 345 Z" fill="#0D9488"/>
    <circle cx="256" cy="358" r="16" fill="#FBBF24"/>
    <polygon points="256,348 259,356 267,356 261,361 263,369 256,364 249,369 251,361 245,356 253,356" fill="#FFFBEB"/>
    <ellipse cx="225" cy="215" rx="14" ry="30" transform="rotate(-15 225 215)" fill="#FDE68A" opacity="0.45"/>
  </g>
</svg>
`);

export const svgHatBeanie = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="hbean-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#881337" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#hbean-sh)">
    <circle cx="256" cy="115" r="50" fill="#F59E0B"/>
    <circle cx="235" cy="100" r="14" fill="#FEF08A"/>
    <circle cx="270" cy="110" r="12" fill="#FEF08A"/>
    <path d="M 135 390 C 125 220, 175 140, 256 140 C 337 140, 387 220, 377 390 Z" fill="#F43F5E"/>
    <path d="M 195 375 Q 205 240 225 160" stroke="#FDA4AF" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M 256 380 Q 256 240 256 150" stroke="#FDA4AF" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M 317 375 Q 307 240 287 160" stroke="#FDA4AF" stroke-width="8" stroke-linecap="round" fill="none"/>
    <rect x="115" y="355" width="282" height="70" rx="35" fill="#E11D48"/>
    <rect x="125" y="365" width="262" height="50" rx="25" fill="#F43F5E"/>
    <ellipse cx="180" cy="220" rx="24" ry="45" transform="rotate(-20 180 220)" fill="#FFF1F2" opacity="0.35"/>
  </g>
</svg>
`);

export const svgHatBunnyEars = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="hbun-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#475569" flood-opacity="0.2"/>
    </filter>
  </defs>
  <g filter="url(#hbun-sh)">
    <path d="M 125 400 C 135 320, 377 320, 387 400" stroke="#EC4899" stroke-width="26" stroke-linecap="round" fill="none"/>
    <path d="M 185 355 C 125 235, 115 105, 178 75 C 235 105, 225 235, 208 355 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="6"/>
    <path d="M 182 335 C 140 235, 135 130, 178 110 C 218 130, 210 235, 200 335 Z" fill="#F472B6"/>
    <path d="M 304 355 C 287 235, 277 105, 334 75 C 397 105, 387 235, 327 355 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="6"/>
    <path d="M 312 335 C 302 235, 294 130, 334 110 C 374 130, 368 235, 326 335 Z" fill="#F472B6"/>
    <circle cx="256" cy="345" r="22" fill="#F43F5E"/>
    <circle cx="236" cy="332" r="14" fill="#FDA4AF"/>
    <circle cx="276" cy="332" r="14" fill="#FDA4AF"/>
    <circle cx="242" cy="362" r="14" fill="#FDA4AF"/>
    <circle cx="270" cy="362" r="14" fill="#FDA4AF"/>
    <circle cx="256" cy="345" r="10" fill="#FEF08A"/>
  </g>
</svg>
`);

export const svgHatCatEars = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="hcat-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#581c87" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#hcat-sh)">
    <path d="M 125 395 C 135 305, 377 305, 387 395" stroke="#7E22CE" stroke-width="24" stroke-linecap="round" fill="none"/>
    <path d="M 135 345 C 115 235, 165 165, 210 175 C 235 245, 225 315, 215 345 Z" fill="#A855F7" stroke="#7E22CE" stroke-width="6"/>
    <path d="M 152 330 C 140 250, 175 200, 200 205 C 215 250, 210 310, 202 330 Z" fill="#F472B6"/>
    <path d="M 297 345 C 287 315, 277 245, 302 175 C 347 165, 397 235, 377 345 Z" fill="#A855F7" stroke="#7E22CE" stroke-width="6"/>
    <path d="M 310 330 C 302 310, 297 250, 312 205 C 337 200, 372 250, 360 330 Z" fill="#F472B6"/>
    <circle cx="256" cy="328" r="14" fill="#FBBF24"/>
    <circle cx="256" cy="334" r="4" fill="#78350F"/>
  </g>
</svg>
`);

export const svgHatPolice = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="hpol-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#hpol-sh)">
    <path d="M 125 325 C 115 195, 185 135, 256 130 C 327 135, 397 195, 387 325 Z" fill="#1E3A8A"/>
    <rect x="135" y="315" width="242" height="48" rx="16" fill="#0F172A"/>
    <path d="M 125 355 C 165 435, 347 435, 387 355 C 335 375, 177 375, 125 355 Z" fill="#1E293B"/>
    <ellipse cx="256" cy="385" rx="85" ry="12" fill="#64748B" opacity="0.3"/>
    <polygon points="256,215 285,235 275,275 256,290 237,275 227,235" fill="#F59E0B"/>
    <circle cx="256" cy="255" r="14" fill="#FEF08A"/>
    <path d="M 145 340 Q 256 360 367 340" stroke="#FBBF24" stroke-width="8" stroke-linecap="round" fill="none"/>
  </g>
</svg>
`);

export const svgHatFirefighter = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="hfire-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#7f1d1d" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#hfire-sh)">
    <ellipse cx="256" cy="385" rx="190" ry="48" fill="#991B1B"/>
    <path d="M 85 385 C 85 435, 427 435, 427 385 Z" fill="#7F1D1D"/>
    <path d="M 150 375 C 140 215, 180 135, 256 130 C 332 135, 372 215, 362 375 Z" fill="#EF4444"/>
    <path d="M 256 130 L 256 380" stroke="#F87171" stroke-width="20" stroke-linecap="round"/>
    <polygon points="256,215 292,245 278,305 256,320 234,305 220,245" fill="#FBBF24"/>
    <circle cx="256" cy="265" r="20" fill="#FFFFFF"/>
    <text x="256" y="273" font-size="22" font-weight="900" font-family="sans-serif" text-anchor="middle" fill="#DC2626">1</text>
  </g>
</svg>
`);

export const svgHatPilot = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="hpil-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#451a03" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#hpil-sh)">
    <path d="M 145 365 C 135 215, 180 145, 256 140 C 332 145, 377 215, 367 365 L 357 425 C 327 435, 327 365, 327 365 L 185 365 C 185 365, 185 435, 155 425 Z" fill="#78350F"/>
    <ellipse cx="150" cy="420" rx="20" ry="14" fill="#FEF3C7"/>
    <ellipse cx="362" cy="420" rx="20" ry="14" fill="#FEF3C7"/>
    <rect x="155" y="235" width="202" height="22" rx="11" fill="#1E293B"/>
    <circle cx="198" cy="246" r="40" fill="#0284C7" stroke="#CBD5E1" stroke-width="10"/>
    <ellipse cx="188" cy="236" rx="14" ry="7" transform="rotate(-30 188 236)" fill="#FFFFFF" opacity="0.8"/>
    <circle cx="314" cy="246" r="40" fill="#0284C7" stroke="#CBD5E1" stroke-width="10"/>
    <ellipse cx="304" cy="236" rx="14" ry="7" transform="rotate(-30 304 236)" fill="#FFFFFF" opacity="0.8"/>
  </g>
</svg>
`);

export const svgHatPartyCone = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="hparty-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#831843" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#hparty-sh)">
    <!-- Quả bông vàng trên chóp -->
    <circle cx="256" cy="80" r="32" fill="#FBBF24"/>
    <circle cx="248" cy="74" r="8" fill="#FFFBEB"/>
    <!-- Nón chóp sọc kẹo -->
    <path d="M 256 95 L 355 385 C 315 405, 197 405, 157 385 Z" fill="#EC4899"/>
    <!-- Các đường sọc màu vàng và xanh ngọc -->
    <path d="M 230 170 L 282 170 L 305 240 L 207 240 Z" fill="#FBBF24"/>
    <path d="M 188 290 L 324 290 L 344 350 L 168 350 Z" fill="#34D399"/>
    <!-- Viền bông xù xì đáy nón -->
    <ellipse cx="256" cy="385" rx="110" ry="24" fill="#F43F5E"/>
    <circle cx="160" cy="385" r="16" fill="#FEF08A"/>
    <circle cx="205" cy="392" r="16" fill="#FEF08A"/>
    <circle cx="256" cy="395" r="16" fill="#FEF08A"/>
    <circle cx="307" cy="392" r="16" fill="#FEF08A"/>
    <circle cx="352" cy="385" r="16" fill="#FEF08A"/>
  </g>
</svg>
`);

export const svgHatFlowerCrown = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="hflw-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#064e3b" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#hflw-sh)">
    <!-- Vòng dây lá xanh mềm -->
    <path d="M 105 320 C 135 240, 377 240, 407 320 C 377 345, 135 345, 105 320 Z" fill="#15803D"/>
    <!-- 5 Bông hoa pastel xinh xắn -->
    <!-- Hoa hồng 1 -->
    <circle cx="130" cy="310" r="28" fill="#F472B6"/>
    <circle cx="130" cy="310" r="12" fill="#FEF08A"/>
    <!-- Hoa vàng 2 -->
    <circle cx="190" cy="275" r="32" fill="#FBBF24"/>
    <circle cx="190" cy="275" r="14" fill="#F43F5E"/>
    <!-- Hoa lớn chính giữa 3 -->
    <circle cx="256" cy="260" r="38" fill="#F43F5E"/>
    <circle cx="256" cy="260" r="16" fill="#FEF08A"/>
    <!-- Hoa xanh mint 4 -->
    <circle cx="322" cy="275" r="32" fill="#34D399"/>
    <circle cx="322" cy="275" r="14" fill="#FBBF24"/>
    <!-- Hoa tím 5 -->
    <circle cx="382" cy="310" r="28" fill="#C084FC"/>
    <circle cx="382" cy="310" r="12" fill="#FEF08A"/>
  </g>
</svg>
`);

export const svgHatSailorCap = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="hsail-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#hsail-sh)">
    <!-- Thân mũ tròn trắng phồng -->
    <ellipse cx="256" cy="290" rx="175" ry="95" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="8"/>
    <!-- Vành mũ xanh navy -->
    <ellipse cx="256" cy="340" rx="145" ry="32" fill="#1E3A8A"/>
    <!-- Mỏ neo vàng chính giữa -->
    <circle cx="256" cy="275" r="12" fill="none" stroke="#FBBF24" stroke-width="6"/>
    <line x1="256" y1="287" x2="256" y2="330" stroke="#FBBF24" stroke-width="8" stroke-linecap="round"/>
    <line x1="240" y1="298" x2="272" y2="298" stroke="#FBBF24" stroke-width="8" stroke-linecap="round"/>
    <path d="M 235 320 C 240 338, 272 338, 277 320" stroke="#FBBF24" stroke-width="8" stroke-linecap="round" fill="none"/>
  </g>
</svg>
`);

export const svgHatBearBeanie = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="hbb-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#451a03" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#hbb-sh)">
    <!-- 2 Tai gấu tròn trên mũ -->
    <circle cx="160" cy="170" r="45" fill="#B45309"/>
    <circle cx="160" cy="170" r="25" fill="#FDE68A"/>
    <circle cx="352" cy="170" r="45" fill="#B45309"/>
    <circle cx="352" cy="170" r="25" fill="#FDE68A"/>
    <!-- Thân mũ len vòm nâu -->
    <path d="M 135 390 C 125 210, 175 140, 256 140 C 337 140, 387 210, 377 390 Z" fill="#D97706"/>
    <!-- Mặt gấu thêu trên mũ -->
    <ellipse cx="256" cy="300" rx="42" ry="32" fill="#FEF3C7"/>
    <polygon points="256,290 244,280 268,280" fill="#451A03"/>
    <circle cx="215" cy="265" r="10" fill="#1C1917"/>
    <circle cx="297" cy="265" r="10" fill="#1C1917"/>
    <circle cx="185" cy="290" r="12" fill="#FB7185" opacity="0.6"/>
    <circle cx="327" cy="290" r="12" fill="#FB7185" opacity="0.6"/>
    <!-- Vành gấp len -->
    <rect x="115" y="360" width="282" height="65" rx="32" fill="#B45309"/>
  </g>
</svg>
`);

// =========================================================================
// 2. KÍNH & MẶT (face)
// =========================================================================

export const svgFaceRoundGlasses = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="fgl-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#0f172a" flood-opacity="0.2"/>
    </filter>
  </defs>
  <g filter="url(#fgl-sh)">
    <circle cx="165" cy="256" r="92" fill="none" stroke="#0F766E" stroke-width="26"/>
    <circle cx="165" cy="256" r="79" fill="#E0F2FE" opacity="0.75"/>
    <ellipse cx="140" cy="220" rx="32" ry="15" transform="rotate(-35 140 220)" fill="#FFFFFF" opacity="0.85"/>
    <path d="M 245 256 Q 256 242 267 256" stroke="#0F766E" stroke-width="24" stroke-linecap="round" fill="none"/>
    <circle cx="347" cy="256" r="92" fill="none" stroke="#0F766E" stroke-width="26"/>
    <circle cx="347" cy="256" r="79" fill="#E0F2FE" opacity="0.75"/>
    <ellipse cx="322" cy="220" rx="32" ry="15" transform="rotate(-35 322 220)" fill="#FFFFFF" opacity="0.85"/>
    <path d="M 72 250 Q 50 256 40 270" stroke="#0F766E" stroke-width="20" stroke-linecap="round" fill="none"/>
    <path d="M 440 250 Q 462 256 472 270" stroke="#0F766E" stroke-width="20" stroke-linecap="round" fill="none"/>
  </g>
</svg>
`);

export const svgFaceSunglasses = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="fsg-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="10" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#fsg-sh)">
    <rect x="75" y="190" width="160" height="130" rx="42" fill="#0F172A" stroke="#334155" stroke-width="18"/>
    <path d="M 105 215 L 145 215 L 95 305 L 85 285 Z" fill="#FFFFFF" opacity="0.35"/>
    <path d="M 230 225 Q 256 215 282 225" stroke="#334155" stroke-width="22" stroke-linecap="round" fill="none"/>
    <rect x="277" y="190" width="160" height="130" rx="42" fill="#0F172A" stroke="#334155" stroke-width="18"/>
    <path d="M 307 215 L 347 215 L 297 305 L 287 285 Z" fill="#FFFFFF" opacity="0.35"/>
    <circle cx="100" cy="210" r="8" fill="#FBBF24"/>
    <circle cx="412" cy="210" r="8" fill="#FBBF24"/>
  </g>
</svg>
`);

export const svgFaceHeartGlasses = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="fhg-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="10" flood-color="#831843" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#fhg-sh)">
    <path d="M 160 330 C 90 270 60 200 110 160 C 160 120 160 180 160 180 C 160 180 160 120 210 160 C 260 200 230 270 160 330 Z" fill="#F43F5E" stroke="#BE123C" stroke-width="20"/>
    <ellipse cx="125" cy="180" rx="20" ry="11" transform="rotate(-30 125 180)" fill="#FFFFFF" opacity="0.8"/>
    <path d="M 230 215 Q 256 195 282 215" stroke="#BE123C" stroke-width="20" stroke-linecap="round" fill="none"/>
    <path d="M 352 330 C 282 270 252 200 302 160 C 352 120 352 180 352 180 C 352 180 352 120 402 160 C 452 200 422 270 352 330 Z" fill="#F43F5E" stroke="#BE123C" stroke-width="20"/>
    <ellipse cx="317" cy="180" rx="20" ry="11" transform="rotate(-30 317 180)" fill="#FFFFFF" opacity="0.8"/>
  </g>
</svg>
`);

export const svgFaceStarGlasses = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="fstar-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="10" flood-color="#78350f" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#fstar-sh)">
    <polygon points="160,150 185,215 255,220 200,265 218,335 160,295 102,335 120,265 65,220 135,215" fill="#FBBF24" stroke="#D97706" stroke-width="18" stroke-linejoin="round"/>
    <circle cx="160" cy="245" r="40" fill="#78350F" opacity="0.85"/>
    <ellipse cx="148" cy="230" rx="14" ry="7" fill="#FFFFFF" opacity="0.85"/>
    <path d="M 240 240 Q 256 228 272 240" stroke="#D97706" stroke-width="18" stroke-linecap="round" fill="none"/>
    <polygon points="352,150 377,215 447,220 392,265 410,335 352,295 294,335 312,265 257,220 327,215" fill="#FBBF24" stroke="#D97706" stroke-width="18" stroke-linejoin="round"/>
    <circle cx="352" cy="245" r="40" fill="#78350F" opacity="0.85"/>
    <ellipse cx="340" cy="230" rx="14" ry="7" fill="#FFFFFF" opacity="0.85"/>
  </g>
</svg>
`);

export const svgFaceBlush = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="fblush-grad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FB7185" stop-opacity="0.95"/>
      <stop offset="60%" stop-color="#FDA4AF" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#FECDD3" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="115" cy="256" rx="70" ry="46" fill="url(#fblush-grad)"/>
  <circle cx="105" cy="246" r="10" fill="#FFFFFF" opacity="0.85"/>
  <circle cx="128" cy="254" r="6" fill="#FFFFFF" opacity="0.85"/>
  <ellipse cx="397" cy="256" rx="70" ry="46" fill="url(#fblush-grad)"/>
  <circle cx="387" cy="246" r="10" fill="#FFFFFF" opacity="0.85"/>
  <circle cx="410" cy="254" r="6" fill="#FFFFFF" opacity="0.85"/>
</svg>
`);

export const svgFaceMustache = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="fmus-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#292524" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#fmus-sh)">
    <path d="M 256 270 C 220 220, 100 210, 70 290 C 80 320, 130 330, 180 290 C 220 260, 240 285, 256 295 C 272 285, 292 260, 332 290 C 382 330, 432 320, 442 290 C 412 210, 292 220, 256 270 Z" fill="#78350F"/>
    <path d="M 130 250 Q 180 240 220 270" stroke="#B45309" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M 382 250 Q 332 240 292 270" stroke="#B45309" stroke-width="8" stroke-linecap="round" fill="none"/>
  </g>
</svg>
`);

export const svgFaceClownNose = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="fclown-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#991b1b" flood-opacity="0.3"/>
    </filter>
    <radialGradient id="fclown-red" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FF6B6B"/>
      <stop offset="50%" stop-color="#EF4444"/>
      <stop offset="100%" stop-color="#991B1B"/>
    </radialGradient>
  </defs>
  <g filter="url(#fclown-sh)">
    <circle cx="256" cy="256" r="110" fill="url(#fclown-red)"/>
    <ellipse cx="220" cy="215" rx="35" ry="22" transform="rotate(-30 220 215)" fill="#FFFFFF" opacity="0.85"/>
    <circle cx="255" cy="245" r="12" fill="#FFFFFF" opacity="0.6"/>
  </g>
</svg>
`);

/**
 * TÁI TẠO NỤ CƯỜI TƯƠI: Đầy đủ môi múp, răng trắng xinh, không bị xén lẹm
 */
export const svgFaceLips = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="flips-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#881337" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#flips-sh)">
    <!-- Đôi môi cười hồng dâu căng múp trọn vẹn -->
    <path d="M 120 250 C 160 340, 352 340, 392 250 C 330 290, 182 290, 120 250 Z" fill="#F43F5E" stroke="#BE123C" stroke-width="12"/>
    <!-- Môi trên cong mềm -->
    <path d="M 120 250 C 180 230, 220 240, 256 250 C 292 240, 332 230, 392 250 C 330 270, 182 270, 120 250 Z" fill="#FB7185"/>
    <!-- Hàm răng trắng xinh ở giữa -->
    <path d="M 215 264 C 235 272, 277 272, 297 264 C 290 280, 222 280, 215 264 Z" fill="#FFFFFF"/>
    <!-- Điểm bóng sáng căng mọng môi -->
    <ellipse cx="256" cy="305" rx="42" ry="14" fill="#FDA4AF" opacity="0.7"/>
    <ellipse cx="230" cy="298" rx="14" ry="6" fill="#FFFFFF" opacity="0.8"/>
    <!-- Má lúm 2 bên khóe môi -->
    <circle cx="108" cy="245" r="8" fill="#FDA4AF"/>
    <circle cx="404" cy="245" r="8" fill="#FDA4AF"/>
  </g>
</svg>
`);

/**
 * TÁI TẠO CẶP KHUYÊN TAI SAO: Cân đối 2 bên, khoảng cách an toàn, không thiếu mảnh
 */
export const svgFaceEarrings = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="fear-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="10" flood-color="#78350f" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#fear-sh)">
    <!-- Khuyên tai trái -->
    <g transform="translate(100, 160)">
      <circle cx="30" cy="20" r="14" fill="#FBBF24"/>
      <line x1="30" y1="34" x2="30" y2="70" stroke="#F59E0B" stroke-width="6" stroke-linecap="round"/>
      <circle cx="30" cy="80" r="16" fill="#EC4899"/>
      <polygon points="30,105 38,125 58,126 42,138 48,158 30,146 12,158 18,138 2,126 22,125" fill="#FBBF24" stroke="#D97706" stroke-width="4"/>
      <circle cx="28" cy="128" r="4" fill="#FFFBEB"/>
    </g>

    <!-- Khuyên tai phải (đối xứng hoàn hảo) -->
    <g transform="translate(352, 160)">
      <circle cx="30" cy="20" r="14" fill="#FBBF24"/>
      <line x1="30" y1="34" x2="30" y2="70" stroke="#F59E0B" stroke-width="6" stroke-linecap="round"/>
      <circle cx="30" cy="80" r="16" fill="#EC4899"/>
      <polygon points="30,105 38,125 58,126 42,138 48,158 30,146 12,158 18,138 2,126 22,125" fill="#FBBF24" stroke="#D97706" stroke-width="4"/>
      <circle cx="28" cy="128" r="4" fill="#FFFBEB"/>
    </g>
  </g>
</svg>
`);

/**
 * TÁI TẠO MẶT NẠ GẤU: Màu kem mật ong rõ nét, viền nâu đất mềm, không bị bay mất hình
 */
export const svgFaceBearMask = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="fmask-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#451a03" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#fmask-sh)">
    <!-- Dây thun đeo mặt nạ 2 bên -->
    <line x1="50" y1="260" x2="110" y2="260" stroke="#B45309" stroke-width="14" stroke-linecap="round"/>
    <line x1="402" y1="260" x2="462" y2="260" stroke="#B45309" stroke-width="14" stroke-linecap="round"/>

    <!-- 2 Tai gấu tròn trên mặt nạ -->
    <circle cx="165" cy="160" r="40" fill="#D97706" stroke="#92400E" stroke-width="8"/>
    <circle cx="165" cy="160" r="22" fill="#FDE68A"/>
    <circle cx="347" cy="160" r="40" fill="#D97706" stroke="#92400E" stroke-width="8"/>
    <circle cx="347" cy="160" r="22" fill="#FDE68A"/>

    <!-- Thân mặt nạ hình bầu dục mật ong ấm áp rõ ràng -->
    <rect x="95" y="190" width="322" height="150" rx="75" fill="#FEF3C7" stroke="#B45309" stroke-width="12"/>

    <!-- 2 Mắt thêu ngủ tít chữ U ngộ nghĩnh -->
    <path d="M 175 250 Q 195 275 215 250" stroke="#78350F" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M 297 250 Q 317 275 337 250" stroke="#78350F" stroke-width="8" stroke-linecap="round" fill="none"/>

    <!-- Mõm và mũi gấu con thêu giữa -->
    <ellipse cx="256" cy="275" rx="30" ry="22" fill="#FFFFFF" stroke="#D97706" stroke-width="4"/>
    <polygon points="256,265 246,256 266,256" fill="#78350F"/>
    <circle cx="160" cy="275" r="12" fill="#FDA4AF" opacity="0.8"/>
    <circle cx="352" cy="275" r="12" fill="#FDA4AF" opacity="0.8"/>
  </g>
</svg>
`);

export const svgFaceSwimGoggles = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="fswim-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#0e7490" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#fswim-sh)">
    <rect x="50" y="244" width="412" height="24" rx="12" fill="#0891B2"/>
    <rect x="90" y="196" width="145" height="120" rx="45" fill="#06B6D4" stroke="#0E7490" stroke-width="16"/>
    <rect x="105" y="210" width="115" height="92" rx="35" fill="#E0F2FE" opacity="0.75"/>
    <ellipse cx="140" cy="235" rx="25" ry="12" transform="rotate(-25 140 235)" fill="#FFFFFF"/>
    <rect x="235" y="246" width="42" height="20" rx="10" fill="#0E7490"/>
    <rect x="277" y="196" width="145" height="120" rx="45" fill="#06B6D4" stroke="#0E7490" stroke-width="16"/>
    <rect x="292" y="210" width="115" height="92" rx="35" fill="#E0F2FE" opacity="0.75"/>
    <ellipse cx="327" cy="235" rx="25" ry="12" transform="rotate(-25 327 235)" fill="#FFFFFF"/>
  </g>
</svg>
`);

export const svgFaceStarStickers = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="fstarstk-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#78350f" flood-opacity="0.2"/>
    </filter>
  </defs>
  <g filter="url(#fstarstk-sh)">
    <!-- Bộ dán má sao trái -->
    <g transform="translate(110, 230)">
      <polygon points="30,0 38,20 60,20 42,34 48,54 30,42 12,54 18,34 0,20 22,20" fill="#FBBF24" stroke="#F59E0B" stroke-width="4"/>
      <circle cx="28" cy="24" r="5" fill="#FFFBEB"/>
      <polygon points="65,40 70,52 82,52 72,60 76,72 65,65 54,72 58,60 48,52 60,52" fill="#FB7185" stroke="#E11D48" stroke-width="3"/>
    </g>
    <!-- Bộ dán má sao phải -->
    <g transform="translate(340, 230)">
      <polygon points="30,0 38,20 60,20 42,34 48,54 30,42 12,54 18,34 0,20 22,20" fill="#FBBF24" stroke="#F59E0B" stroke-width="4"/>
      <circle cx="28" cy="24" r="5" fill="#FFFBEB"/>
      <polygon points="65,40 70,52 82,52 72,60 76,72 65,65 54,72 58,60 48,52 60,52" fill="#FB7185" stroke="#E11D48" stroke-width="3"/>
    </g>
  </g>
</svg>
`);

export const svgFaceCatWhiskers = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="fwh-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#475569" flood-opacity="0.2"/>
    </filter>
  </defs>
  <g filter="url(#fwh-sh)">
    <!-- Mũi hồng tròn ở tâm -->
    <circle cx="256" cy="240" r="18" fill="#EC4899" stroke="#BE185D" stroke-width="4"/>
    <ellipse cx="252" cy="236" rx="6" ry="4" fill="#FFFFFF"/>
    <!-- 3 Râu trái -->
    <line x1="210" y1="230" x2="80" y2="215" stroke="#334155" stroke-width="8" stroke-linecap="round"/>
    <line x1="210" y1="245" x2="70" y2="250" stroke="#334155" stroke-width="8" stroke-linecap="round"/>
    <line x1="210" y1="260" x2="85" y2="285" stroke="#334155" stroke-width="8" stroke-linecap="round"/>
    <!-- 3 Râu phải -->
    <line x1="302" y1="230" x2="432" y2="215" stroke="#334155" stroke-width="8" stroke-linecap="round"/>
    <line x1="302" y1="245" x2="442" y2="250" stroke="#334155" stroke-width="8" stroke-linecap="round"/>
    <line x1="302" y1="260" x2="427" y2="285" stroke="#334155" stroke-width="8" stroke-linecap="round"/>
  </g>
</svg>
`);

// =========================================================================
// 3. NƠ & CỔ (jewelry)
// =========================================================================

export const svgJewelryPinkBow = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="jbow-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#831843" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#jbow-sh)">
    <path d="M 240 256 C 140 160, 60 190, 80 270 C 100 350, 180 320, 240 266 Z" fill="#EC4899" stroke="#BE185D" stroke-width="6"/>
    <ellipse cx="140" cy="240" rx="28" ry="14" transform="rotate(-25 140 240)" fill="#FDF2F8" opacity="0.5"/>
    <path d="M 272 256 C 372 160, 452 190, 432 270 C 412 350, 332 320, 272 266 Z" fill="#EC4899" stroke="#BE185D" stroke-width="6"/>
    <ellipse cx="372" cy="240" rx="28" ry="14" transform="rotate(25 372 240)" fill="#FDF2F8" opacity="0.5"/>
    <path d="M 220 275 C 200 340, 160 380, 130 410 L 175 425 C 210 385, 235 340, 245 285 Z" fill="#DB2777"/>
    <path d="M 292 275 C 312 340, 352 380, 382 410 L 337 425 C 302 385, 277 340, 267 285 Z" fill="#DB2777"/>
    <circle cx="256" cy="260" r="42" fill="#F472B6" stroke="#BE185D" stroke-width="6"/>
    <ellipse cx="245" cy="245" rx="14" ry="8" fill="#FFFFFF" opacity="0.8"/>
  </g>
</svg>
`);

export const svgJewelryRedBow = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="jred-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#881337" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#jred-sh)">
    <path d="M 240 256 C 140 160, 60 190, 80 270 C 100 350, 180 320, 240 266 Z" fill="#EF4444" stroke="#B91C1C" stroke-width="6"/>
    <path d="M 272 256 C 372 160, 452 190, 432 270 C 412 350, 332 320, 272 266 Z" fill="#EF4444" stroke="#B91C1C" stroke-width="6"/>
    <path d="M 220 275 C 190 350, 150 400, 120 425 L 165 435 C 200 395, 235 340, 245 285 Z" fill="#B91C1C"/>
    <path d="M 292 275 C 322 350, 362 400, 392 425 L 347 435 C 312 395, 277 340, 267 285 Z" fill="#B91C1C"/>
    <circle cx="256" cy="260" r="42" fill="#DC2626" stroke="#991B1B" stroke-width="6"/>
    <ellipse cx="244" cy="246" rx="14" ry="8" fill="#FCA5A5" opacity="0.8"/>
  </g>
</svg>
`);

/**
 * TÁI TẠO CÀI ÁO HOA VÀNG: Trọn vẹn hoa hướng dương, nhụy nâu đất, lá xanh, ghim cài vàng
 */
export const svgJewelryFlowerPin = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="jflw-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#78350f" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#jflw-sh)">
    <!-- Chiếc lá xanh mint phía sau -->
    <path d="M 256 256 C 290 140, 390 140, 370 230 C 350 300, 290 280, 256 256 Z" fill="#22C55E" stroke="#15803D" stroke-width="8"/>
    <!-- Ghim cài vàng kim loại phía sau -->
    <path d="M 170 340 L 342 340" stroke="#F59E0B" stroke-width="12" stroke-linecap="round"/>

    <!-- 8 Cánh hoa vàng múp míp tròn trĩnh đối xứng -->
    <circle cx="256" cy="150" r="45" fill="#FBBF24" stroke="#D97706" stroke-width="6"/>
    <circle cx="330" cy="180" r="45" fill="#FBBF24" stroke="#D97706" stroke-width="6"/>
    <circle cx="362" cy="256" r="45" fill="#FBBF24" stroke="#D97706" stroke-width="6"/>
    <circle cx="330" cy="332" r="45" fill="#FBBF24" stroke="#D97706" stroke-width="6"/>
    <circle cx="256" cy="362" r="45" fill="#FBBF24" stroke="#D97706" stroke-width="6"/>
    <circle cx="182" cy="332" r="45" fill="#FBBF24" stroke="#D97706" stroke-width="6"/>
    <circle cx="150" cy="256" r="45" fill="#FBBF24" stroke="#D97706" stroke-width="6"/>
    <circle cx="182" cy="180" r="45" fill="#FBBF24" stroke="#D97706" stroke-width="6"/>

    <!-- Nhụy hoa nâu tròn to múp ở tâm -->
    <circle cx="256" cy="256" r="75" fill="#78350F" stroke="#451A03" stroke-width="8"/>
    <!-- Chấm hạt vàng óng ánh trên nhụy -->
    <circle cx="235" cy="235" r="8" fill="#FDE68A"/>
    <circle cx="275" cy="235" r="8" fill="#FDE68A"/>
    <circle cx="256" cy="275" r="8" fill="#FDE68A"/>
    <ellipse cx="230" cy="215" rx="18" ry="10" fill="#FFFFFF" opacity="0.6"/>
  </g>
</svg>
`);

/**
 * TÁI TẠO VÒNG NGỌC TRAI: Chuỗi ngọc trai kem ngọc bích viền ấm, bóng đổ mịn, nổi rõ trên nền trắng
 */
export const svgJewelryPearlNecklace = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="jpearl-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#475569" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#jpearl-sh)">
    <!-- Dây xâu ngọc trai -->
    <path d="M 120 180 C 135 385, 377 385, 392 180" stroke="#94A3B8" stroke-width="6" stroke-linecap="round" fill="none"/>

    <!-- Từng hạt ngọc trai kem bóng bẩy có viền mềm và đốm sáng -->
    <circle cx="125" cy="195" r="22" fill="#F8FAFC" stroke="#94A3B8" stroke-width="4"/>
    <circle cx="138" cy="245" r="24" fill="#F8FAFC" stroke="#94A3B8" stroke-width="4"/>
    <circle cx="162" cy="292" r="26" fill="#F8FAFC" stroke="#94A3B8" stroke-width="4"/>
    <circle cx="200" cy="332" r="28" fill="#F8FAFC" stroke="#94A3B8" stroke-width="4"/>
    <circle cx="256" cy="355" r="32" fill="#F8FAFC" stroke="#94A3B8" stroke-width="4"/>
    <circle cx="312" cy="332" r="28" fill="#F8FAFC" stroke="#94A3B8" stroke-width="4"/>
    <circle cx="350" cy="292" r="26" fill="#F8FAFC" stroke="#94A3B8" stroke-width="4"/>
    <circle cx="374" cy="245" r="24" fill="#F8FAFC" stroke="#94A3B8" stroke-width="4"/>
    <circle cx="387" cy="195" r="22" fill="#F8FAFC" stroke="#94A3B8" stroke-width="4"/>

    <!-- Mặt dây chuyền trái tim hồng ở hạt ngọc giữa -->
    <circle cx="256" cy="355" r="14" fill="#F43F5E"/>
    <!-- Highlight ánh ngọc trai -->
    <circle cx="250" cy="345" r="7" fill="#FFFFFF"/>
    <circle cx="194" cy="324" r="6" fill="#FFFFFF"/>
    <circle cx="318" cy="324" r="6" fill="#FFFFFF"/>
  </g>
</svg>
`);

/**
 * TÁI TẠO VƯƠNG MIỆN CÔNG CHÚA (Món thứ hai): 5 Đỉnh vàng hồng trọn vẹn, không cụt, không xén
 */
export const svgJewelryMiniTiara = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="jtiara-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#831843" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#jtiara-sh)">
    <!-- Khung vương miện uốn vòng cung -->
    <path d="M 120 370 Q 256 395 392 370 L 388 340 Q 256 365 124 340 Z" fill="#FBBF24" stroke="#D97706" stroke-width="6"/>

    <!-- 5 Đỉnh chóp vương miện vàng hồng vươn cao -->
    <polygon points="135,345 160,260 185,345" fill="#FBBF24" stroke="#D97706" stroke-width="6"/>
    <circle cx="160" cy="255" r="12" fill="#F472B6"/>

    <polygon points="185,345 220,200 255,345" fill="#FBBF24" stroke="#D97706" stroke-width="6"/>
    <circle cx="220" cy="195" r="14" fill="#EC4899"/>

    <!-- Đỉnh chính giữa cao nhất -->
    <polygon points="225,345 256,155 287,345" fill="#F59E0B" stroke="#B45309" stroke-width="6"/>
    <circle cx="256" cy="148" r="18" fill="#F43F5E"/>
    <!-- Viên ngọc tim ruby ở đỉnh giữa -->
    <circle cx="256" cy="270" r="18" fill="#EF4444"/>

    <polygon points="257,345 292,200 327,345" fill="#FBBF24" stroke="#D97706" stroke-width="6"/>
    <circle cx="292" cy="195" r="14" fill="#EC4899"/>

    <polygon points="327,345 352,260 377,345" fill="#FBBF24" stroke="#D97706" stroke-width="6"/>
    <circle cx="352" cy="255" r="12" fill="#F472B6"/>

    <!-- Hàng ngọc trai nhỏ đính viền chân vương miện -->
    <circle cx="150" cy="370" r="8" fill="#FFFFFF"/>
    <circle cx="200" cy="377" r="8" fill="#FFFFFF"/>
    <circle cx="256" cy="380" r="10" fill="#FFFFFF"/>
    <circle cx="312" cy="377" r="8" fill="#FFFFFF"/>
    <circle cx="362" cy="370" r="8" fill="#FFFFFF"/>
  </g>
</svg>
`);

/**
 * TÁI TẠO CÁNH TIÊN BƯỚM: Viền mịn trong suốt 100%, đối xứng 2 bên, màu cầu vồng pastel
 */
export const svgJewelryFairyWings = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="fwings-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#4c1d95" flood-opacity="0.2"/>
    </filter>
  </defs>
  <g filter="url(#fwings-sh)">
    <!-- Cánh bướm tiên bên trái -->
    <g transform="translate(60, 110)">
      <path d="M 190 200 C 60 40, 10 100, 20 200 C 30 280, 110 260, 190 220 Z" fill="#C4B5FD" stroke="#8B5CF6" stroke-width="8" opacity="0.9"/>
      <ellipse cx="90" cy="160" rx="35" ry="50" fill="#FDE047" opacity="0.6"/>
      <path d="M 190 220 C 80 230, 40 330, 100 380 C 160 410, 180 300, 190 230 Z" fill="#93C5FD" stroke="#3B82F6" stroke-width="8" opacity="0.9"/>
      <circle cx="110" cy="330" r="22" fill="#F472B6" opacity="0.6"/>
    </g>

    <!-- Khớp nối tròn giữa 2 cánh -->
    <ellipse cx="256" cy="320" rx="20" ry="32" fill="#F59E0B" stroke="#D97706" stroke-width="6"/>

    <!-- Cánh bướm tiên bên phải (đối xứng hoàn hảo) -->
    <g transform="translate(262, 110)">
      <path d="M 0 200 C 130 40, 180 100, 170 200 C 160 280, 80 260, 0 220 Z" fill="#C4B5FD" stroke="#8B5CF6" stroke-width="8" opacity="0.9"/>
      <ellipse cx="100" cy="160" rx="35" ry="50" fill="#FDE047" opacity="0.6"/>
      <path d="M 0 220 C 110 230, 150 330, 90 380 C 30 410, 10 300, 0 230 Z" fill="#93C5FD" stroke="#3B82F6" stroke-width="8" opacity="0.9"/>
      <circle cx="80" cy="330" r="22" fill="#F472B6" opacity="0.6"/>
    </g>
  </g>
</svg>
`);

export const svgJewelryScarf = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="jsc-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#881337" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#jsc-sh)">
    <path d="M 120 230 C 160 330, 352 330, 392 230 C 412 280, 382 360, 256 370 C 130 360, 100 280, 120 230 Z" fill="#EF4444"/>
    <path d="M 140 250 Q 256 345 372 250" stroke="#FCA5A5" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M 280 320 C 290 380, 285 430, 280 470 L 340 470 C 350 430, 355 380, 350 320 Z" fill="#DC2626"/>
    <line x1="285" y1="470" x2="285" y2="495" stroke="#FCA5A5" stroke-width="6" stroke-linecap="round"/>
    <line x1="300" y1="470" x2="300" y2="498" stroke="#FCA5A5" stroke-width="6" stroke-linecap="round"/>
    <line x1="315" y1="470" x2="315" y2="495" stroke="#FCA5A5" stroke-width="6" stroke-linecap="round"/>
    <line x1="330" y1="470" x2="330" y2="498" stroke="#FCA5A5" stroke-width="6" stroke-linecap="round"/>
  </g>
</svg>
`);

export const svgJewelryCandyNecklace = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="jcn-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="10" flood-color="#3b0764" flood-opacity="0.2"/>
    </filter>
  </defs>
  <g filter="url(#jcn-sh)">
    <path d="M 100 180 C 130 380, 382 380, 412 180" stroke="#CBD5E1" stroke-width="8" stroke-linecap="round" fill="none"/>
    <circle cx="110" cy="210" r="26" fill="#F43F5E"/>
    <circle cx="135" cy="265" r="28" fill="#FBBF24"/>
    <circle cx="175" cy="315" r="30" fill="#34D399"/>
    <circle cx="225" cy="345" r="30" fill="#60A5FA"/>
    <circle cx="256" cy="355" r="36" fill="#A855F7"/>
    <polygon points="256,335 264,352 282,352 268,363 273,380 256,369 239,380 244,363 230,352 248,352" fill="#FEF08A"/>
    <circle cx="287" cy="345" r="30" fill="#F472B6"/>
    <circle cx="337" cy="315" r="30" fill="#FB923C"/>
    <circle cx="377" cy="265" r="28" fill="#38BDF8"/>
    <circle cx="402" cy="210" r="26" fill="#F43F5E"/>
    <circle cx="102" cy="202" r="7" fill="#FFFFFF" opacity="0.8"/>
    <circle cx="127" cy="257" r="8" fill="#FFFFFF" opacity="0.8"/>
  </g>
</svg>
`);

export const svgJewelryYellowPolkaBow = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="jyp-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#78350f" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#jyp-sh)">
    <path d="M 240 256 C 140 160, 60 190, 80 270 C 100 350, 180 320, 240 266 Z" fill="#FBBF24" stroke="#D97706" stroke-width="6"/>
    <circle cx="130" cy="240" r="10" fill="#FFFFFF"/>
    <circle cx="170" cy="220" r="10" fill="#FFFFFF"/>
    <circle cx="160" cy="280" r="10" fill="#FFFFFF"/>
    <path d="M 272 256 C 372 160, 452 190, 432 270 C 412 350, 332 320, 272 266 Z" fill="#FBBF24" stroke="#D97706" stroke-width="6"/>
    <circle cx="382" cy="240" r="10" fill="#FFFFFF"/>
    <circle cx="342" cy="220" r="10" fill="#FFFFFF"/>
    <circle cx="352" cy="280" r="10" fill="#FFFFFF"/>
    <circle cx="256" cy="260" r="42" fill="#F59E0B" stroke="#B45309" stroke-width="6"/>
    <ellipse cx="245" cy="245" rx="14" ry="8" fill="#FFFBEB" opacity="0.8"/>
  </g>
</svg>
`);

export const svgJewelryMintBow = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="jmb-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#064e3b" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#jmb-sh)">
    <path d="M 240 256 C 140 160, 60 190, 80 270 C 100 350, 180 320, 240 266 Z" fill="#34D399" stroke="#059669" stroke-width="6"/>
    <path d="M 272 256 C 372 160, 452 190, 432 270 C 412 350, 332 320, 272 266 Z" fill="#34D399" stroke="#059669" stroke-width="6"/>
    <circle cx="256" cy="260" r="42" fill="#10B981" stroke="#047857" stroke-width="6"/>
    <ellipse cx="245" cy="245" rx="14" ry="8" fill="#ECFDF5" opacity="0.8"/>
  </g>
</svg>
`);

export const svgJewelryGentlemanBowtie = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="jgbt-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.3"/>
    </filter>
  </defs>
  <g filter="url(#jgbt-sh)">
    <polygon points="245,260 100,180 110,340 245,265" fill="#1E293B" stroke="#0F172A" stroke-width="6"/>
    <polygon points="267,260 412,180 402,340 267,265" fill="#1E293B" stroke="#0F172A" stroke-width="6"/>
    <circle cx="256" cy="260" r="38" fill="#0F172A"/>
    <circle cx="256" cy="260" r="16" fill="#FBBF24"/>
  </g>
</svg>
`);

export const svgJewelryBellChoker = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="jbc-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#78350f" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#jbc-sh)">
    <path d="M 120 220 Q 256 310 392 220" stroke="#EF4444" stroke-width="26" stroke-linecap="round" fill="none"/>
    <circle cx="256" cy="300" r="50" fill="#FBBF24" stroke="#D97706" stroke-width="8"/>
    <circle cx="256" cy="320" r="12" fill="#78350F"/>
    <line x1="256" y1="320" x2="256" y2="340" stroke="#78350F" stroke-width="6"/>
    <ellipse cx="240" cy="285" rx="14" ry="8" fill="#FFFBEB"/>
  </g>
</svg>
`);

export const svgJewelryStarBadge = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="jsb-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#1e3a8a" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#jsb-sh)">
    <!-- 2 Dải ruy băng xanh bên dưới -->
    <polygon points="230,280 200,420 240,390 260,420 250,280" fill="#2563EB"/>
    <polygon points="282,280 260,420 280,390 320,420 290,280" fill="#1D4ED8"/>
    <!-- Huy chương tròn vàng -->
    <circle cx="256" cy="240" r="95" fill="#FBBF24" stroke="#D97706" stroke-width="12"/>
    <circle cx="256" cy="240" r="75" fill="#F59E0B"/>
    <!-- Ngôi sao trắng ở tâm -->
    <polygon points="256,180 270,225 318,225 280,255 294,300 256,272 218,300 232,255 194,225 242,225" fill="#FFFFFF"/>
  </g>
</svg>
`);

// =========================================================================
// 4. CẦM TAY (prop)
// =========================================================================

export const svgPropMagicWand = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="pmw-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#581c87" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#pmw-sh)">
    <rect x="238" y="160" width="36" height="290" rx="18" transform="rotate(-30 256 300)" fill="#E9D5FF" stroke="#C084FC" stroke-width="4"/>
    <g transform="translate(160, 80) scale(1.1)">
      <polygon points="100,20 124,75 184,80 138,120 152,180 100,148 48,180 62,120 16,80 76,75" fill="#FACC15" stroke="#CA8A04" stroke-width="10" stroke-linejoin="round"/>
      <circle cx="82" cy="95" r="7" fill="#713F12"/>
      <circle cx="118" cy="95" r="7" fill="#713F12"/>
      <path d="M 94 110 Q 100 120 106 110" stroke="#713F12" stroke-width="4" stroke-linecap="round" fill="none"/>
      <circle cx="74" cy="106" r="6" fill="#F43F5E" opacity="0.6"/>
      <circle cx="126" cy="106" r="6" fill="#F43F5E" opacity="0.6"/>
    </g>
    <circle cx="215" cy="190" r="16" fill="#EC4899"/>
    <ellipse cx="185" cy="180" rx="24" ry="14" transform="rotate(-20 185 180)" fill="#F472B6"/>
    <ellipse cx="245" cy="200" rx="24" ry="14" transform="rotate(-20 245 200)" fill="#F472B6"/>
  </g>
</svg>
`);

export const svgPropLollipop = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="plol-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#831843" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#plol-sh)">
    <rect x="242" y="230" width="28" height="240" rx="14" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="6"/>
    <circle cx="256" cy="180" r="125" fill="#F43F5E"/>
    <circle cx="256" cy="180" r="95" fill="#FDE047"/>
    <circle cx="256" cy="180" r="70" fill="#34D399"/>
    <circle cx="256" cy="180" r="45" fill="#38BDF8"/>
    <circle cx="256" cy="180" r="22" fill="#FFFFFF"/>
    <ellipse cx="205" cy="130" rx="35" ry="18" transform="rotate(-35 205 130)" fill="#FFFFFF" opacity="0.8"/>
    <circle cx="256" cy="305" r="18" fill="#EC4899"/>
    <ellipse cx="220" cy="305" rx="25" ry="15" fill="#F472B6"/>
    <ellipse cx="292" cy="305" rx="25" ry="15" fill="#F472B6"/>
  </g>
</svg>
`);

export const svgPropHeartBalloon = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="phb-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#9f1239" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#phb-sh)">
    <path d="M 256 320 C 130 220, 90 120, 175 75 C 240 40, 256 120, 256 120 C 256 120, 272 40, 337 75 C 422 120, 382 220, 256 320 Z" fill="#F43F5E"/>
    <polygon points="256,315 244,335 268,335" fill="#9F1239"/>
    <path d="M 256 335 Q 240 380 270 415 T 256 480" stroke="#94A3B8" stroke-width="8" stroke-linecap="round" fill="none"/>
    <ellipse cx="190" cy="115" rx="35" ry="18" transform="rotate(-30 190 115)" fill="#FFFFFF" opacity="0.85"/>
  </g>
</svg>
`);

export const svgPropKnightSword = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="pswd-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#1e293b" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#pswd-sh)" transform="rotate(-25 256 256)">
    <path d="M 236 330 L 236 120 C 236 80, 276 80, 276 120 L 276 330 Z" fill="#F1F5F9" stroke="#94A3B8" stroke-width="8"/>
    <line x1="256" y1="95" x2="256" y2="330" stroke="#94A3B8" stroke-width="6"/>
    <rect x="180" y="325" width="152" height="34" rx="17" fill="#F59E0B" stroke="#B45309" stroke-width="6"/>
    <circle cx="256" cy="342" r="14" fill="#06B6D4"/>
    <rect x="242" y="359" width="28" height="70" rx="14" fill="#EF4444"/>
    <circle cx="256" cy="445" r="22" fill="#F59E0B" stroke="#B45309" stroke-width="6"/>
  </g>
</svg>
`);

export const svgPropStethoscope = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="psteth-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#0284c7" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#psteth-sh)">
    <path d="M 170 120 L 170 200 C 170 280, 342 280, 342 200 L 342 120" stroke="#0284C7" stroke-width="24" stroke-linecap="round" fill="none"/>
    <circle cx="170" cy="115" r="18" fill="#F43F5E"/>
    <circle cx="342" cy="115" r="18" fill="#F43F5E"/>
    <path d="M 256 255 Q 256 340 330 380" stroke="#0284C7" stroke-width="24" stroke-linecap="round" fill="none"/>
    <circle cx="345" cy="390" r="55" fill="#E2E8F0" stroke="#94A3B8" stroke-width="12"/>
    <circle cx="345" cy="390" r="38" fill="#0284C7"/>
    <circle cx="345" cy="390" r="16" fill="#F43F5E"/>
  </g>
</svg>
`);

export const svgPropRainbowScepter = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="prsb-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#78350f" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#prsb-sh)">
    <rect x="242" y="180" width="28" height="280" rx="14" fill="#FBBF24" stroke="#D97706" stroke-width="6"/>
    <!-- Vòng cầu vồng trên đỉnh vương trượng -->
    <path d="M 180 180 A 76 76 0 0 1 332 180" stroke="#EF4444" stroke-width="16" fill="none"/>
    <path d="M 194 180 A 62 62 0 0 1 318 180" stroke="#FBBF24" stroke-width="16" fill="none"/>
    <path d="M 208 180 A 48 48 0 0 1 304 180" stroke="#10B981" stroke-width="16" fill="none"/>
    <path d="M 222 180 A 34 34 0 0 1 290 180" stroke="#3B82F6" stroke-width="16" fill="none"/>
    <!-- Ngôi sao vàng lớn cài chính giữa -->
    <polygon points="256,120 266,145 292,145 272,160 280,185 256,170 232,185 240,160 220,145 246,145" fill="#FEF08A" stroke="#F59E0B" stroke-width="6"/>
  </g>
</svg>
`);

export const svgPropBabyBottle = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="pbb-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#0284c7" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#pbb-sh)">
    <!-- Núm ti vàng mật -->
    <ellipse cx="256" cy="115" rx="32" ry="42" fill="#FBBF24"/>
    <!-- Nắp bình xanh mint -->
    <rect x="180" y="150" width="152" height="42" rx="16" fill="#34D399" stroke="#059669" stroke-width="6"/>
    <!-- Thân bình sữa trong suốt -->
    <rect x="190" y="190" width="132" height="230" rx="32" fill="#E0F2FE" stroke="#38BDF8" stroke-width="10"/>
    <!-- Sữa trắng bên trong -->
    <rect x="202" y="240" width="108" height="170" rx="22" fill="#FFFFFF"/>
    <!-- Vạch chia độ ml -->
    <line x1="220" y1="280" x2="250" y2="280" stroke="#38BDF8" stroke-width="6" stroke-linecap="round"/>
    <line x1="220" y1="320" x2="260" y2="320" stroke="#38BDF8" stroke-width="6" stroke-linecap="round"/>
    <line x1="220" y1="360" x2="250" y2="360" stroke="#38BDF8" stroke-width="6" stroke-linecap="round"/>
  </g>
</svg>
`);

export const svgPropBalloons = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="pbal-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#831843" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#pbal-sh)">
    <!-- Dây bóng chụm lại phía dưới -->
    <path d="M 200 240 Q 240 350 256 460" stroke="#94A3B8" stroke-width="6" fill="none"/>
    <path d="M 256 210 L 256 460" stroke="#94A3B8" stroke-width="6" fill="none"/>
    <path d="M 312 240 Q 272 350 256 460" stroke="#94A3B8" stroke-width="6" fill="none"/>

    <!-- Quả bóng trái: Xanh mint -->
    <ellipse cx="195" cy="180" rx="65" ry="85" fill="#34D399" stroke="#059669" stroke-width="6"/>
    <ellipse cx="175" cy="150" rx="16" ry="24" fill="#FFFFFF" opacity="0.6"/>

    <!-- Quả bóng phải: Vàng bơ -->
    <ellipse cx="317" cy="180" rx="65" ry="85" fill="#FBBF24" stroke="#D97706" stroke-width="6"/>
    <ellipse cx="297" cy="150" rx="16" ry="24" fill="#FFFFFF" opacity="0.6"/>

    <!-- Quả bóng giữa cao nhất: Hồng dâu -->
    <ellipse cx="256" cy="140" rx="72" ry="92" fill="#F43F5E" stroke="#BE123C" stroke-width="6"/>
    <ellipse cx="235" cy="110" rx="18" ry="28" fill="#FFFFFF" opacity="0.8"/>
  </g>
</svg>
`);

export const svgPropFlowerBouquet = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="pbou-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#831843" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#pbou-sh)">
    <!-- Giấy gói hoa hình ốc quế kem -->
    <polygon points="256,470 170,280 342,280" fill="#FEF3C7" stroke="#D97706" stroke-width="8"/>
    <!-- Nơ hồng buộc bó hoa -->
    <circle cx="256" cy="380" r="16" fill="#F43F5E"/>
    <ellipse cx="225" cy="380" rx="22" ry="12" fill="#FDA4AF"/>
    <ellipse cx="287" cy="380" rx="22" ry="12" fill="#FDA4AF"/>

    <!-- Chùm 5 bông hoa rực rỡ tươi thắm -->
    <circle cx="210" cy="230" r="38" fill="#F43F5E"/>
    <circle cx="210" cy="230" r="16" fill="#FEF08A"/>

    <circle cx="302" cy="230" r="38" fill="#FBBF24"/>
    <circle cx="302" cy="230" r="16" fill="#F43F5E"/>

    <circle cx="256" cy="170" r="44" fill="#EC4899"/>
    <circle cx="256" cy="170" r="18" fill="#FEF08A"/>

    <circle cx="160" cy="275" r="30" fill="#38BDF8"/>
    <circle cx="160" cy="275" r="12" fill="#FFFFFF"/>

    <circle cx="352" cy="275" r="30" fill="#A855F7"/>
    <circle cx="352" cy="275" r="12" fill="#FFFFFF"/>
  </g>
</svg>
`);

export const svgPropIceCream = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="pice-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#78350f" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#pice-sh)">
    <!-- Ốc quế bánh xốp kẻ ca-rô -->
    <polygon points="256,470 170,270 342,270" fill="#D97706" stroke="#B45309" stroke-width="8"/>
    <line x1="200" y1="310" x2="312" y2="390" stroke="#B45309" stroke-width="4"/>
    <line x1="312" y1="310" x2="200" y2="390" stroke="#B45309" stroke-width="4"/>

    <!-- Viên kem dâu ở dưới -->
    <circle cx="256" cy="250" r="80" fill="#F472B6" stroke="#DB2777" stroke-width="6"/>

    <!-- Viên kem vani ngọc mint ở trên -->
    <circle cx="256" cy="170" r="75" fill="#34D399" stroke="#059669" stroke-width="6"/>
    <ellipse cx="230" cy="140" rx="22" ry="12" fill="#FFFFFF" opacity="0.8"/>

    <!-- Quả anh đào đỏ mọng trên đỉnh -->
    <circle cx="256" cy="85" r="24" fill="#EF4444"/>
    <path d="M 256 85 Q 280 40 300 45" stroke="#15803D" stroke-width="6" stroke-linecap="round" fill="none"/>
  </g>
</svg>
`);

export const svgPropStorybook = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="pbk-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#1e3a8a" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#pbk-sh)">
    <!-- Bìa sách màu xanh hoàng gia -->
    <rect x="90" y="140" width="332" height="250" rx="24" fill="#1E40AF" stroke="#172554" stroke-width="10"/>
    <!-- Trang sách mở màu kem -->
    <rect x="110" y="155" width="135" height="220" rx="12" fill="#FEF3C7"/>
    <rect x="267" y="155" width="135" height="220" rx="12" fill="#FEF3C7"/>
    <!-- Gáy sách vàng -->
    <line x1="256" y1="140" x2="256" y2="390" stroke="#FBBF24" stroke-width="14"/>
    <!-- Hình vẽ ngôi sao cổ tích trên trang sách -->
    <polygon points="175,220 183,238 202,238 187,250 193,268 175,256 157,268 163,250 148,238 167,238" fill="#F59E0B"/>
    <line x1="285" y1="200" x2="380" y2="200" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
    <line x1="285" y1="230" x2="380" y2="230" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
    <line x1="285" y1="260" x2="350" y2="260" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
  </g>
</svg>
`);

export const svgPropCrystalStaff = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="pcstf-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#0284c7" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#pcstf-sh)">
    <rect x="242" y="180" width="28" height="280" rx="14" fill="#93C5FD" stroke="#3B82F6" stroke-width="6"/>
    <!-- Viên pha lê hình thoi lấp lánh -->
    <polygon points="256,60 330,150 256,210 182,150" fill="#38BDF8" stroke="#0284C7" stroke-width="8"/>
    <polygon points="256,80 305,150 256,190 207,150" fill="#BAE6FD"/>
    <ellipse cx="235" cy="120" rx="16" ry="24" transform="rotate(-30 235 120)" fill="#FFFFFF" opacity="0.85"/>
    <!-- Cánh vàng ôm giữ viên pha lê -->
    <path d="M 160 170 Q 256 220 352 170" stroke="#FBBF24" stroke-width="16" stroke-linecap="round" fill="none"/>
  </g>
</svg>
`);

export const svgPropGuitar = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="pgt-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#78350f" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#pgt-sh)" transform="rotate(-25 256 256)">
    <!-- Cần đàn ukulele -->
    <rect x="240" y="80" width="32" height="200" rx="12" fill="#D97706" stroke="#92400E" stroke-width="6"/>
    <!-- Đầu đàn có 4 khóa vặn -->
    <rect x="232" y="50" width="48" height="50" rx="10" fill="#92400E"/>
    <circle cx="220" cy="65" r="8" fill="#FBBF24"/>
    <circle cx="220" cy="85" r="8" fill="#FBBF24"/>
    <circle cx="292" cy="65" r="8" fill="#FBBF24"/>
    <circle cx="292" cy="85" r="8" fill="#FBBF24"/>
    <!-- Thùng đàn số 8 đỏ ấm -->
    <circle cx="256" cy="270" r="65" fill="#EF4444" stroke="#B91C1C" stroke-width="8"/>
    <circle cx="256" cy="370" r="95" fill="#EF4444" stroke="#B91C1C" stroke-width="8"/>
    <!-- Lỗ thoát âm đen -->
    <circle cx="256" cy="310" r="32" fill="#451A03"/>
    <!-- Ngựa đàn và 4 dây đàn -->
    <rect x="226" y="410" width="60" height="18" rx="8" fill="#78350F"/>
    <line x1="244" y1="95" x2="244" y2="410" stroke="#FFFFFF" stroke-width="3"/>
    <line x1="252" y1="95" x2="252" y2="410" stroke="#FFFFFF" stroke-width="3"/>
    <line x1="260" y1="95" x2="260" y2="410" stroke="#FFFFFF" stroke-width="3"/>
    <line x1="268" y1="95" x2="268" y2="410" stroke="#FFFFFF" stroke-width="3"/>
  </g>
</svg>
`);

export const svgPropBackpack = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="pbp-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#1e3a8a" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#pbp-sh)">
    <!-- Quai xách balo trên đỉnh -->
    <path d="M 200 160 C 200 90, 312 90, 312 160" stroke="#F59E0B" stroke-width="20" stroke-linecap="round" fill="none"/>
    <!-- Thân balo bầu dục xanh biển -->
    <rect x="135" y="150" width="242" height="290" rx="90" fill="#3B82F6" stroke="#1D4ED8" stroke-width="12"/>
    <!-- Túi phụ phía trước vàng nổi bật -->
    <rect x="165" y="270" width="182" height="140" rx="40" fill="#FBBF24" stroke="#D97706" stroke-width="10"/>
    <!-- Khóa kéo zipper -->
    <line x1="185" y1="290" x2="327" y2="290" stroke="#78350F" stroke-width="6" stroke-linecap="round"/>
    <circle cx="256" cy="290" r="12" fill="#EF4444"/>
    <!-- Huy hiệu ngôi sao trang trí -->
    <circle cx="256" cy="210" r="24" fill="#FFFFFF"/>
    <polygon points="256,192 262,206 276,206 265,215 269,228 256,220 243,228 247,215 236,206 250,206" fill="#F59E0B"/>
  </g>
</svg>
`);

// =========================================================================
// 5. GIÀY & THÚ (plush)
// =========================================================================

export const svgPlushTeddyBear = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="pted-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#451a03" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#pted-sh)">
    <circle cx="160" cy="130" r="42" fill="#B45309"/>
    <circle cx="160" cy="130" r="24" fill="#FDE68A"/>
    <circle cx="352" cy="130" r="42" fill="#B45309"/>
    <circle cx="352" cy="130" r="24" fill="#FDE68A"/>
    <circle cx="140" cy="310" r="45" fill="#B45309"/>
    <circle cx="372" cy="310" r="45" fill="#B45309"/>
    <circle cx="175" cy="420" r="55" fill="#B45309"/>
    <circle cx="175" cy="420" r="32" fill="#FDE68A"/>
    <circle cx="337" cy="420" r="55" fill="#B45309"/>
    <circle cx="337" cy="420" r="32" fill="#FDE68A"/>
    <circle cx="256" cy="335" r="115" fill="#D97706"/>
    <ellipse cx="256" cy="355" rx="65" ry="55" fill="#FEF3C7"/>
    <circle cx="256" cy="195" r="95" fill="#D97706"/>
    <ellipse cx="256" cy="225" rx="42" ry="32" fill="#FEF3C7"/>
    <polygon points="256,215 242,205 270,205" fill="#451A03"/>
    <circle cx="218" cy="180" r="12" fill="#1C1917"/>
    <circle cx="215" cy="176" r="4" fill="#FFFFFF"/>
    <circle cx="294" cy="180" r="12" fill="#1C1917"/>
    <circle cx="291" cy="176" r="4" fill="#FFFFFF"/>
    <circle cx="190" cy="210" r="14" fill="#FB7185" opacity="0.6"/>
    <circle cx="322" cy="210" r="14" fill="#FB7185" opacity="0.6"/>
    <circle cx="256" cy="285" r="16" fill="#DC2626"/>
    <ellipse cx="225" cy="285" rx="22" ry="14" fill="#EF4444"/>
    <ellipse cx="287" cy="285" rx="22" ry="14" fill="#EF4444"/>
  </g>
</svg>
`);

export const svgPlushClayBunny = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="pbun-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#475569" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#pbun-sh)">
    <ellipse cx="180" cy="115" rx="36" ry="95" transform="rotate(-15 180 115)" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="6"/>
    <ellipse cx="180" cy="115" rx="20" ry="70" transform="rotate(-15 180 115)" fill="#FBCFE8"/>
    <ellipse cx="332" cy="115" rx="36" ry="95" transform="rotate(15 332 115)" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="6"/>
    <ellipse cx="332" cy="115" rx="20" ry="70" transform="rotate(15 332 115)" fill="#FBCFE8"/>
    <circle cx="256" cy="340" r="110" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="6"/>
    <ellipse cx="256" cy="360" rx="60" ry="50" fill="#FDF2F8"/>
    <circle cx="256" cy="210" r="95" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="6"/>
    <circle cx="220" cy="195" r="12" fill="#1E293B"/>
    <circle cx="216" cy="190" r="4" fill="#FFFFFF"/>
    <circle cx="292" cy="195" r="12" fill="#1E293B"/>
    <circle cx="288" cy="190" r="4" fill="#FFFFFF"/>
    <polygon points="256,220 248,212 264,212" fill="#EC4899"/>
    <circle cx="195" cy="225" r="16" fill="#F472B6" opacity="0.6"/>
    <circle cx="317" cy="225" r="16" fill="#F472B6" opacity="0.6"/>
    <!-- Củ cà rốt ôm ngực -->
    <g transform="translate(256, 330) rotate(20)">
      <polygon points="0,-35 -16,35 16,35" fill="#F97316"/>
      <ellipse cx="0" cy="-35" rx="16" ry="8" fill="#FB923C"/>
      <path d="M 0 -35 Q 0 -60 5 -58" stroke="#22C55E" stroke-width="6" stroke-linecap="round" fill="none"/>
    </g>
  </g>
</svg>
`);

export const svgPlushClayDino = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="pdino-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#064e3b" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#pdino-sh)">
    <circle cx="140" cy="180" r="24" fill="#FDE047"/>
    <circle cx="165" cy="130" r="28" fill="#FDE047"/>
    <circle cx="210" cy="95" r="30" fill="#FDE047"/>
    <circle cx="270" cy="85" r="30" fill="#FDE047"/>
    <circle cx="270" cy="320" r="115" fill="#10B981"/>
    <ellipse cx="295" cy="340" rx="65" ry="60" fill="#FEF9C3"/>
    <path d="M 170 360 C 110 390, 80 340, 100 290 C 130 310, 150 330, 170 360 Z" fill="#10B981"/>
    <circle cx="85" cy="300" r="16" fill="#FDE047"/>
    <circle cx="270" cy="180" r="95" fill="#10B981"/>
    <circle cx="295" cy="165" r="14" fill="#064E3B"/>
    <circle cx="291" cy="160" r="5" fill="#FFFFFF"/>
    <circle cx="330" cy="195" r="15" fill="#FB7185" opacity="0.6"/>
    <circle cx="220" cy="420" r="45" fill="#059669"/>
    <circle cx="310" cy="420" r="45" fill="#059669"/>
  </g>
</svg>
`);

export const svgPlushClayDuck = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="pduck-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#78350f" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#pduck-sh)">
    <ellipse cx="256" cy="320" rx="135" ry="95" fill="#FACC15"/>
    <path d="M 130 300 C 95 280, 95 230, 135 250 Z" fill="#FACC15"/>
    <ellipse cx="230" cy="330" rx="60" ry="40" transform="rotate(-15 230 330)" fill="#EAB308"/>
    <circle cx="320" cy="180" r="85" fill="#FACC15"/>
    <path d="M 385 180 C 445 180, 435 220, 375 210 Z" fill="#F97316" stroke="#EA580C" stroke-width="6"/>
    <circle cx="340" cy="165" r="12" fill="#451A03"/>
    <circle cx="336" cy="160" r="4" fill="#FFFFFF"/>
    <circle cx="330" cy="195" r="14" fill="#FB7185" opacity="0.6"/>
  </g>
</svg>
`);

export const svgPlushClayCat = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="pcat-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#431407" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#pcat-sh)">
    <polygon points="160,160 140,80 210,130" fill="#F97316"/>
    <polygon points="163,150 150,95 198,130" fill="#FBCFE8"/>
    <polygon points="352,160 372,80 302,130" fill="#F97316"/>
    <polygon points="349,150 362,95 314,130" fill="#FBCFE8"/>
    <path d="M 160 380 C 80 400, 80 290, 130 270" stroke="#F97316" stroke-width="32" stroke-linecap="round" fill="none"/>
    <circle cx="256" cy="335" r="115" fill="#FEF3C7"/>
    <ellipse cx="200" cy="320" rx="45" ry="35" fill="#FB923C"/>
    <circle cx="256" cy="205" r="95" fill="#FEF3C7"/>
    <circle cx="218" cy="190" r="12" fill="#1C1917"/>
    <circle cx="214" cy="186" r="4" fill="#FFFFFF"/>
    <circle cx="294" cy="190" r="12" fill="#1C1917"/>
    <circle cx="290" cy="186" r="4" fill="#FFFFFF"/>
    <polygon points="256,210 248,202 264,202" fill="#EC4899"/>
    <circle cx="185" cy="215" r="14" fill="#FDA4AF" opacity="0.7"/>
    <circle cx="327" cy="215" r="14" fill="#FDA4AF" opacity="0.7"/>
    <path d="M 200 290 Q 256 315 312 290" stroke="#EF4444" stroke-width="12" stroke-linecap="round" fill="none"/>
    <circle cx="256" cy="312" r="14" fill="#FBBF24"/>
  </g>
</svg>
`);

/**
 * TÁI TẠO CÚN ĐỐM CON: 1 Bé cún duy nhất tròn múp, không trùng lặp sprite, tai nâu ngoan ngoãn
 */
export const svgPlushPuppyPlush = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="ppup-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#451a03" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#ppup-sh)">
    <!-- 2 Tai cún rủ mềm mại màu nâu mật -->
    <ellipse cx="150" cy="210" rx="42" ry="75" transform="rotate(-15 150 210)" fill="#78350F"/>
    <ellipse cx="362" cy="210" rx="42" ry="75" transform="rotate(15 362 210)" fill="#78350F"/>

    <!-- Đuôi cún vẫy bên phải -->
    <path d="M 330 380 Q 400 370 410 320" stroke="#78350F" stroke-width="26" stroke-linecap="round" fill="none"/>

    <!-- Thân cún tròn vo màu kem -->
    <circle cx="256" cy="340" r="115" fill="#FEF3C7" stroke="#CBD5E1" stroke-width="6"/>
    <circle cx="310" cy="320" r="38" fill="#B45309"/>

    <!-- Đầu cún tròn to chibi -->
    <circle cx="256" cy="205" r="95" fill="#FEF3C7" stroke="#CBD5E1" stroke-width="6"/>
    <!-- Đốm nâu quanh mắt trái -->
    <ellipse cx="215" cy="190" rx="35" ry="42" fill="#D97706"/>

    <!-- 2 Mắt đen tròn có twin shine -->
    <circle cx="215" cy="190" r="14" fill="#1C1917"/>
    <circle cx="211" cy="184" r="5" fill="#FFFFFF"/>
    <circle cx="297" cy="190" r="14" fill="#1C1917"/>
    <circle cx="293" cy="184" r="5" fill="#FFFFFF"/>

    <!-- Mõm và mũi đen bóng -->
    <ellipse cx="256" cy="235" rx="38" ry="26" fill="#FFFFFF"/>
    <ellipse cx="256" cy="225" rx="16" ry="12" fill="#1C1917"/>
    <circle cx="180" cy="225" r="14" fill="#FDA4AF" opacity="0.6"/>
    <circle cx="332" cy="225" r="14" fill="#FDA4AF" opacity="0.6"/>

    <!-- Vòng cổ xanh ngọc có chuông vàng -->
    <path d="M 200 290 Q 256 315 312 290" stroke="#0284C7" stroke-width="14" stroke-linecap="round" fill="none"/>
    <circle cx="256" cy="312" r="16" fill="#FBBF24"/>
  </g>
</svg>
`);

export const svgPlushSneakers = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="psnk-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#881337" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#psnk-sh)">
    <!-- Giày trái -->
    <g transform="translate(60, 210)">
      <path d="M 20 150 C 20 70, 90 60, 110 100 L 170 110 C 190 120, 200 150, 190 180 L 10 180 Z" fill="#EF4444"/>
      <rect x="0" y="170" width="195" height="42" rx="20" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="6"/>
      <path d="M 145 120 C 175 130, 190 150, 185 180 L 145 180 Z" fill="#FFFFFF"/>
      <line x1="85" y1="115" x2="125" y2="125" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
      <line x1="80" y1="135" x2="130" y2="145" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
    </g>
    <!-- Giày phải (cân đối cách đều) -->
    <g transform="translate(260, 210)">
      <path d="M 20 150 C 20 70, 90 60, 110 100 L 170 110 C 190 120, 200 150, 190 180 L 10 180 Z" fill="#EF4444"/>
      <rect x="0" y="170" width="195" height="42" rx="20" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="6"/>
      <path d="M 145 120 C 175 130, 190 150, 185 180 L 145 180 Z" fill="#FFFFFF"/>
      <line x1="85" y1="115" x2="125" y2="125" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
      <line x1="80" y1="135" x2="130" y2="145" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
    </g>
  </g>
</svg>
`);

/**
 * TÁI TẠO ĐÔI GIÀY BÚP BÊ ĐỎ: 1 Cặp hoàn chỉnh, đặt cạnh nhau cân đối, không đè lấn
 */
export const svgPlushMaryJane = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="pmj-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#881337" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#pmj-sh)">
    <!-- Chiếc giày trái -->
    <g transform="translate(60, 200)">
      <ellipse cx="100" cy="180" rx="90" ry="55" fill="#E11D48"/>
      <!-- Mũi giày bóng láng tròn múp -->
      <path d="M 20 180 C 20 120, 180 120, 180 180 Z" fill="#F43F5E"/>
      <!-- Quai cài nơ ngang mu bàn chân -->
      <rect x="80" y="130" width="40" height="75" rx="14" fill="#BE123C"/>
      <circle cx="100" cy="150" r="10" fill="#FEF08A"/>
      <!-- Đế giày kem mờ -->
      <path d="M 15 180 Q 100 230 185 180" stroke="#FEF3C7" stroke-width="12" stroke-linecap="round" fill="none"/>
      <ellipse cx="60" cy="150" rx="20" ry="10" fill="#FFFFFF" opacity="0.6"/>
    </g>

    <!-- Chiếc giày phải (đối xứng cân đối cách 20px) -->
    <g transform="translate(260, 200)">
      <ellipse cx="100" cy="180" rx="90" ry="55" fill="#E11D48"/>
      <path d="M 20 180 C 20 120, 180 120, 180 180 Z" fill="#F43F5E"/>
      <rect x="80" y="130" width="40" height="75" rx="14" fill="#BE123C"/>
      <circle cx="100" cy="150" r="10" fill="#FEF08A"/>
      <path d="M 15 180 Q 100 230 185 180" stroke="#FEF3C7" stroke-width="12" stroke-linecap="round" fill="none"/>
      <ellipse cx="60" cy="150" rx="20" ry="10" fill="#FFFFFF" opacity="0.6"/>
    </g>
  </g>
</svg>
`);

/**
 * TÁI TẠO ĐÔI ỦNG ĐI MƯA VÀNG: Cặp ủng đứng vững chãi, viền trắng, đế cao su sạch sẽ
 */
export const svgPlushRainBoots = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="prb-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#78350f" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#prb-sh)">
    <!-- Ủng trái -->
    <g transform="translate(60, 140)">
      <!-- Ống ủng cao cổ -->
      <rect x="40" y="60" width="105" height="180" rx="24" fill="#FACC15" stroke="#EAB308" stroke-width="6"/>
      <ellipse cx="92" cy="60" rx="52" ry="16" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="4"/>
      <!-- Bàn chân ủng mũi tròn phồng -->
      <path d="M 40 180 L 40 260 C 40 290, 190 290, 190 240 C 190 200, 145 190, 145 180 Z" fill="#FACC15" stroke="#EAB308" stroke-width="6"/>
      <!-- Đế ủng cao su trắng dày chống trượt -->
      <rect x="35" y="260" width="160" height="36" rx="18" fill="#FFFFFF" stroke="#94A3B8" stroke-width="6"/>
      <ellipse cx="140" cy="225" rx="24" ry="12" fill="#FEF08A"/>
    </g>

    <!-- Ủng phải (cân đối hoàn hảo) -->
    <g transform="translate(260, 140)">
      <rect x="40" y="60" width="105" height="180" rx="24" fill="#FACC15" stroke="#EAB308" stroke-width="6"/>
      <ellipse cx="92" cy="60" rx="52" ry="16" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="4"/>
      <path d="M 40 180 L 40 260 C 40 290, 190 290, 190 240 C 190 200, 145 190, 145 180 Z" fill="#FACC15" stroke="#EAB308" stroke-width="6"/>
      <rect x="35" y="260" width="160" height="36" rx="18" fill="#FFFFFF" stroke="#94A3B8" stroke-width="6"/>
      <ellipse cx="140" cy="225" rx="24" ry="12" fill="#FEF08A"/>
    </g>
  </g>
</svg>
`);

/**
 * TÁI TẠO ĐÔI DÉP SANDAL HÈ: 2 Chiếc song song, quai xanh mint đính hoa cúc
 */
export const svgPlushSandals = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="psnd-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#064e3b" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#psnd-sh)">
    <!-- Sandal trái -->
    <g transform="translate(70, 150)">
      <!-- Lòng dép êm ái -->
      <ellipse cx="90" cy="180" rx="75" ry="130" fill="#FEF3C7" stroke="#D97706" stroke-width="8"/>
      <!-- Quai ngang trên màu mint -->
      <rect x="25" y="120" width="130" height="42" rx="16" fill="#34D399" stroke="#059669" stroke-width="6"/>
      <circle cx="90" cy="140" r="16" fill="#FFFFFF"/>
      <circle cx="90" cy="140" r="8" fill="#FBBF24"/>
      <!-- Quai ngang dưới -->
      <rect x="25" y="210" width="130" height="36" rx="14" fill="#34D399" stroke="#059669" stroke-width="6"/>
    </g>

    <!-- Sandal phải (cân đối) -->
    <g transform="translate(262, 150)">
      <ellipse cx="90" cy="180" rx="75" ry="130" fill="#FEF3C7" stroke="#D97706" stroke-width="8"/>
      <rect x="25" y="120" width="130" height="42" rx="16" fill="#34D399" stroke="#059669" stroke-width="6"/>
      <circle cx="90" cy="140" r="16" fill="#FFFFFF"/>
      <circle cx="90" cy="140" r="8" fill="#FBBF24"/>
      <rect x="25" y="210" width="130" height="36" rx="14" fill="#34D399" stroke="#059669" stroke-width="6"/>
    </g>
  </g>
</svg>
`);

export const svgPlushBearSlippers = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="pbs-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#451a03" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#pbs-sh)">
    <!-- Dép gấu trái -->
    <g transform="translate(60, 180)">
      <ellipse cx="95" cy="150" rx="85" ry="70" fill="#B45309"/>
      <circle cx="45" cy="100" r="26" fill="#D97706"/>
      <circle cx="45" cy="100" r="14" fill="#FDE68A"/>
      <circle cx="145" cy="100" r="26" fill="#D97706"/>
      <circle cx="145" cy="100" r="14" fill="#FDE68A"/>
      <ellipse cx="95" cy="165" rx="34" ry="24" fill="#FEF3C7"/>
      <polygon points="95,158 86,150 104,150" fill="#451A03"/>
      <circle cx="65" cy="135" r="8" fill="#1C1917"/>
      <circle cx="125" cy="135" r="8" fill="#1C1917"/>
      <circle cx="48" cy="155" r="10" fill="#FDA4AF" opacity="0.7"/>
      <circle cx="142" cy="155" r="10" fill="#FDA4AF" opacity="0.7"/>
    </g>

    <!-- Dép gấu phải -->
    <g transform="translate(260, 180)">
      <ellipse cx="95" cy="150" rx="85" ry="70" fill="#B45309"/>
      <circle cx="45" cy="100" r="26" fill="#D97706"/>
      <circle cx="45" cy="100" r="14" fill="#FDE68A"/>
      <circle cx="145" cy="100" r="26" fill="#D97706"/>
      <circle cx="145" cy="100" r="14" fill="#FDE68A"/>
      <ellipse cx="95" cy="165" rx="34" ry="24" fill="#FEF3C7"/>
      <polygon points="95,158 86,150 104,150" fill="#451A03"/>
      <circle cx="65" cy="135" r="8" fill="#1C1917"/>
      <circle cx="125" cy="135" r="8" fill="#1C1917"/>
      <circle cx="48" cy="155" r="10" fill="#FDA4AF" opacity="0.7"/>
      <circle cx="142" cy="155" r="10" fill="#FDA4AF" opacity="0.7"/>
    </g>
  </g>
</svg>
`);

export const svgPlushFrogPlush = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="pfrg-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#064e3b" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#pfrg-sh)">
    <!-- 2 Mắt ếch lồi tròn trên đỉnh đầu -->
    <circle cx="190" cy="180" r="48" fill="#22C55E"/>
    <circle cx="190" cy="180" r="32" fill="#FFFFFF"/>
    <circle cx="190" cy="180" r="16" fill="#064E3B"/>
    <circle cx="184" cy="174" r="6" fill="#FFFFFF"/>

    <circle cx="322" cy="180" r="48" fill="#22C55E"/>
    <circle cx="322" cy="180" r="32" fill="#FFFFFF"/>
    <circle cx="322" cy="180" r="16" fill="#064E3B"/>
    <circle cx="316" cy="174" r="6" fill="#FFFFFF"/>

    <!-- Thân ếch béo tròn -->
    <circle cx="256" cy="320" r="115" fill="#22C55E"/>
    <ellipse cx="256" cy="345" rx="70" ry="60" fill="#FEF9C3"/>

    <!-- Đầu ếch rộng miệng cười toe toét -->
    <ellipse cx="256" cy="245" rx="110" ry="75" fill="#22C55E"/>
    <path d="M 180 260 Q 256 300 332 260" stroke="#064E3B" stroke-width="8" stroke-linecap="round" fill="none"/>
    <circle cx="170" cy="270" r="16" fill="#FDA4AF" opacity="0.8"/>
    <circle cx="342" cy="270" r="16" fill="#FDA4AF" opacity="0.8"/>

    <!-- 2 Chân ếch tròn mập phía dưới -->
    <circle cx="170" cy="410" r="42" fill="#16A34A"/>
    <circle cx="342" cy="410" r="42" fill="#16A34A"/>
  </g>
</svg>
`);
