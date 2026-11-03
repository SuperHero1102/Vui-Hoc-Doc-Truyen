import React from 'react';
import type { DailyCommunicationSituation } from '../data/dailyCommunicationData';

interface DailyScenicArtworkProps {
  scenicType: DailyCommunicationSituation['scenicType'];
  className?: string;
  isCelebrating?: boolean;
}

export const DailyScenicArtwork: React.FC<DailyScenicArtworkProps> = ({
  scenicType,
  className = 'w-full h-48 sm:h-64',
  isCelebrating = false,
}) => {
  return (
    <div
      className={`relative rounded-3xl overflow-hidden border-2 border-white/80 shadow-md select-none ${className}`}
    >
      <svg
        viewBox="0 0 600 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover transition-transform duration-500"
      >
        <defs>
          {/* Universal 3D Gradients */}
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="60%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#E0F2FE" />
          </linearGradient>

          <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>

          <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <linearGradient id="wallWarmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>

          <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>

          <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="doorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. SCENIC: SCHOOL GATE */}
        {scenicType === 'school_gate' && (
          <g>
            <rect width="600" height="360" fill="url(#skyGrad)" />
            {/* Sun & Clouds */}
            <circle cx="520" cy="60" r="38" fill="url(#sunGrad)" filter="url(#softGlow)" />
            <ellipse cx="120" cy="70" rx="45" ry="20" fill="#FFFFFF" opacity="0.85" />
            <ellipse cx="150" cy="65" rx="35" ry="22" fill="#FFFFFF" opacity="0.9" />
            <ellipse cx="400" cy="90" rx="50" ry="18" fill="#FFFFFF" opacity="0.8" />

            {/* School Building */}
            <rect x="140" y="90" width="320" height="170" rx="16" fill="url(#wallWarmGrad)" stroke="#F59E0B" strokeWidth="4" />
            {/* Roof */}
            <polygon points="120,95 300,25 480,95" fill="url(#roofGrad)" />
            {/* Clock Tower */}
            <circle cx="300" cy="70" r="18" fill="#FFFFFF" stroke="#E11D48" strokeWidth="3" />
            <line x1="300" y1="70" x2="300" y2="60" stroke="#E11D48" strokeWidth="3" strokeLinecap="round" />
            <line x1="300" y1="70" x2="310" y2="70" stroke="#E11D48" strokeWidth="3" strokeLinecap="round" />

            {/* School Windows */}
            <rect x="170" y="120" width="45" height="45" rx="10" fill="#7DD3FC" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="385" y="120" width="45" height="45" rx="10" fill="#7DD3FC" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="170" y="180" width="45" height="45" rx="10" fill="#7DD3FC" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="385" y="180" width="45" height="45" rx="10" fill="#7DD3FC" stroke="#FFFFFF" strokeWidth="3" />

            {/* School Door */}
            <rect x="265" y="160" width="70" height="100" rx="12" fill="url(#doorGrad)" stroke="#FFFFFF" strokeWidth="4" />
            <circle cx="280" cy="210" r="4" fill="#FDE047" />

            {/* Ground */}
            <path d="M0,250 Q300,235 600,250 L600,360 L0,360 Z" fill="url(#grassGrad)" />

            {/* School Arch Rainbow Gate */}
            <path d="M 60,260 Q 300,130 540,260" stroke="#F43F5E" strokeWidth="12" fill="none" opacity="0.9" />
            <path d="M 70,260 Q 300,146 530,260" stroke="#F59E0B" strokeWidth="10" fill="none" opacity="0.9" />
            <path d="M 80,260 Q 300,162 520,260" stroke="#10B981" strokeWidth="8" fill="none" opacity="0.9" />

            {/* Gate pillars */}
            <rect x="50" y="220" width="24" height="110" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="3" />
            <rect x="526" y="220" width="24" height="110" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="3" />

            {/* Flowers & Bushes */}
            <circle cx="40" cy="300" r="18" fill="#15803D" />
            <circle cx="65" cy="310" r="14" fill="#22C55E" />
            <circle cx="540" cy="305" r="16" fill="#15803D" />
            <circle cx="565" cy="315" r="14" fill="#22C55E" />
          </g>
        )}

        {/* 2. SCENIC: HOME LEAVING */}
        {scenicType === 'home_leaving' && (
          <g>
            <rect width="600" height="360" fill="url(#skyGrad)" />
            <circle cx="90" cy="70" r="32" fill="url(#sunGrad)" filter="url(#softGlow)" />
            {/* House porch */}
            <rect x="280" y="60" width="340" height="240" rx="16" fill="url(#wallWarmGrad)" stroke="#F59E0B" strokeWidth="4" />
            <polygon points="260,70 450,15 620,70" fill="url(#roofGrad)" />
            {/* Porch door */}
            <rect x="330" y="110" width="90" height="160" rx="14" fill="url(#doorGrad)" stroke="#FFFFFF" strokeWidth="4" />
            <circle cx="400" cy="190" r="5" fill="#FDE047" />

            {/* Porch steps */}
            <rect x="310" y="260" width="130" height="20" rx="6" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="290" y="278" width="170" height="20" rx="6" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" />

            {/* Garden Lawn & Path */}
            <path d="M0,240 Q250,220 600,240 L600,360 L0,360 Z" fill="url(#grassGrad)" />
            <path d="M330,298 Q220,330 80,360 L0,360 L0,310 Q200,280 310,298 Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="3" />

            {/* Potted Flowers on porch */}
            <rect x="460" y="235" width="30" height="30" rx="6" fill="#EA580C" />
            <circle cx="475" cy="225" r="16" fill="#EC4899" />
            <circle cx="475" cy="225" r="6" fill="#FACC15" />
          </g>
        )}

        {/* 3. SCENIC: HOME ARRIVING */}
        {scenicType === 'home_arriving' && (
          <g>
            {/* Living Room Interior */}
            <rect width="600" height="360" fill="#FEF3C7" />
            {/* Floor wooden parquet */}
            <rect x="0" y="220" width="600" height="140" fill="#FBBF24" opacity="0.6" />
            <line x1="0" y1="260" x2="600" y2="260" stroke="#D97706" strokeWidth="2" opacity="0.4" />
            <line x1="0" y1="300" x2="600" y2="300" stroke="#D97706" strokeWidth="2" opacity="0.4" />

            {/* Window with outside sunset garden */}
            <rect x="60" y="40" width="160" height="130" rx="16" fill="#BAE6FD" stroke="#FFFFFF" strokeWidth="6" />
            <line x1="140" y1="40" x2="140" y2="170" stroke="#FFFFFF" strokeWidth="4" />
            <line x1="60" y1="105" x2="220" y2="105" stroke="#FFFFFF" strokeWidth="4" />

            {/* Cozy Sofa */}
            <rect x="360" y="130" width="180" height="110" rx="20" fill="#FB7185" stroke="#E11D48" strokeWidth="4" />
            <rect x="380" y="160" width="140" height="70" rx="14" fill="#FDA4AF" />
            <circle cx="410" cy="190" r="18" fill="#FDE047" />

            {/* Shoe Rack & Slippers */}
            <rect x="60" y="230" width="130" height="60" rx="10" fill="#B45309" stroke="#78350F" strokeWidth="3" />
            <line x1="60" y1="260" x2="190" y2="260" stroke="#78350F" strokeWidth="3" />
            {/* Little cute shoes on rack */}
            <ellipse cx="90" cy="250" rx="16" ry="8" fill="#3B82F6" />
            <ellipse cx="125" cy="250" rx="16" ry="8" fill="#3B82F6" />
            <ellipse cx="90" cy="280" rx="16" ry="8" fill="#EC4899" />
            <ellipse cx="125" cy="280" rx="16" ry="8" fill="#EC4899" />

            {/* Welcome Mat */}
            <rect x="230" y="270" width="140" height="55" rx="12" fill="#10B981" stroke="#059669" strokeWidth="3" />
            <text x="300" y="305" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">
              WELCOME
            </text>
          </g>
        )}

        {/* 4. SCENIC: MARKET SCENE */}
        {scenicType === 'market_scene' && (
          <g>
            <rect width="600" height="360" fill="url(#skyGrad)" />
            {/* Market Stalls Awning (Red & White Stripes) */}
            <path
              d="M 40,60 L 560,60 L 580,120 L 20,120 Z"
              fill="#EF4444"
              stroke="#B91C1C"
              strokeWidth="3"
            />
            {/* White stripe patches */}
            <polygon points="100,60 140,60 135,120 95,120" fill="#FFFFFF" />
            <polygon points="200,60 240,60 235,120 195,120" fill="#FFFFFF" />
            <polygon points="300,60 340,60 335,120 295,120" fill="#FFFFFF" />
            <polygon points="400,60 440,60 435,120 395,120" fill="#FFFFFF" />
            <polygon points="500,60 540,60 535,120 495,120" fill="#FFFFFF" />

            {/* Stall Wooden Table */}
            <rect x="40" y="170" width="520" height="100" rx="12" fill="url(#woodGrad)" stroke="#78350F" strokeWidth="4" />
            <rect x="70" y="260" width="30" height="80" fill="#92400E" />
            <rect x="500" y="260" width="30" height="80" fill="#92400E" />

            {/* Fruit Baskets on Table */}
            {/* Basket 1: Red Apples */}
            <ellipse cx="130" cy="180" rx="45" ry="22" fill="#D97706" stroke="#92400E" strokeWidth="3" />
            <circle cx="115" cy="165" r="12" fill="#EF4444" />
            <circle cx="135" cy="163" r="12" fill="#DC2626" />
            <circle cx="125" cy="150" r="12" fill="#EF4444" />

            {/* Basket 2: Yellow Bananas */}
            <ellipse cx="260" cy="180" rx="45" ry="22" fill="#D97706" stroke="#92400E" strokeWidth="3" />
            <path d="M 235,160 Q 255,145 285,165" stroke="#FBBF24" strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M 240,150 Q 260,135 290,155" stroke="#F59E0B" strokeWidth="10" strokeLinecap="round" fill="none" />

            {/* Basket 3: Green Watermelons */}
            <ellipse cx="400" cy="180" rx="55" ry="25" fill="#D97706" stroke="#92400E" strokeWidth="3" />
            <circle cx="385" cy="160" r="18" fill="#15803D" />
            <line x1="375" y1="150" x2="395" y2="170" stroke="#166534" strokeWidth="3" />
            <circle cx="415" cy="162" r="16" fill="#16A34A" />

            {/* Ground cobblestone */}
            <rect x="0" y="260" width="600" height="100" fill="#E2E8F0" />
            <ellipse cx="180" cy="310" rx="25" ry="12" fill="#CBD5E1" />
            <ellipse cx="320" cy="325" rx="30" ry="14" fill="#CBD5E1" />
            <ellipse cx="460" cy="305" rx="28" ry="13" fill="#CBD5E1" />
          </g>
        )}

        {/* 5. SCENIC: SUPERMARKET */}
        {scenicType === 'supermarket_scene' && (
          <g>
            {/* Supermarket Interior */}
            <rect width="600" height="360" fill="#F0FDF4" />
            {/* Shelves Background */}
            <rect x="40" y="40" width="520" height="180" rx="14" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="4" />
            <line x1="40" y1="100" x2="560" y2="100" stroke="#64748B" strokeWidth="5" />
            <line x1="40" y1="160" x2="560" y2="160" stroke="#64748B" strokeWidth="5" />

            {/* Goods on Shelves */}
            {/* Shelf 1: Milk Cartons */}
            <rect x="80" y="55" width="28" height="40" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
            <rect x="120" y="55" width="28" height="40" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
            <rect x="160" y="55" width="28" height="40" rx="4" fill="#F43F5E" stroke="#E11D48" strokeWidth="2" />
            {/* Shelf 1: Juice Bottles */}
            <rect x="220" y="52" width="24" height="43" rx="6" fill="#F97316" />
            <rect x="255" y="52" width="24" height="43" rx="6" fill="#FACC15" />
            <rect x="290" y="52" width="24" height="43" rx="6" fill="#84CC16" />

            {/* Shelf 2: Strawberry Yogurt cups */}
            <rect x="80" y="115" width="32" height="40" rx="6" fill="#FDA4AF" stroke="#F43F5E" strokeWidth="2" />
            <rect x="125" y="115" width="32" height="40" rx="6" fill="#FDA4AF" stroke="#F43F5E" strokeWidth="2" />
            <rect x="170" y="115" width="32" height="40" rx="6" fill="#FDA4AF" stroke="#F43F5E" strokeWidth="2" />

            {/* Shelf 3: Cereals & Snacks */}
            <rect x="80" y="175" width="40" height="42" rx="4" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
            <rect x="130" y="175" width="40" height="42" rx="4" fill="#FB923C" stroke="#EA580C" strokeWidth="2" />

            {/* Floor tiles */}
            <rect x="0" y="240" width="600" height="120" fill="#FFFFFF" />
            <line x1="0" y1="280" x2="600" y2="280" stroke="#E2E8F0" strokeWidth="2" />
            <line x1="0" y1="320" x2="600" y2="320" stroke="#E2E8F0" strokeWidth="2" />

            {/* Shopping Cart on Floor */}
            <g transform="translate(340, 180)">
              <rect x="10" y="40" width="90" height="55" rx="8" fill="none" stroke="#0284C7" strokeWidth="5" />
              <line x1="10" y1="60" x2="100" y2="60" stroke="#0284C7" strokeWidth="3" />
              <line x1="10" y1="75" x2="100" y2="75" stroke="#0284C7" strokeWidth="3" />
              <line x1="35" y1="40" x2="35" y2="95" stroke="#0284C7" strokeWidth="3" />
              <line x1="65" y1="40" x2="65" y2="95" stroke="#0284C7" strokeWidth="3" />
              {/* Handle */}
              <line x1="10" y1="45" x2="-8" y2="25" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
              {/* Wheels */}
              <circle cx="28" cy="104" r="10" fill="#334155" />
              <circle cx="28" cy="104" r="4" fill="#FFFFFF" />
              <circle cx="82" cy="104" r="10" fill="#334155" />
              <circle cx="82" cy="104" r="4" fill="#FFFFFF" />
            </g>
          </g>
        )}

        {/* 6. SCENIC: PARK PLAYGROUND */}
        {scenicType === 'park_playground' && (
          <g>
            <rect width="600" height="360" fill="url(#skyGrad)" />
            <circle cx="500" cy="70" r="35" fill="url(#sunGrad)" filter="url(#softGlow)" />
            {/* Green Hills in Background */}
            <path d="M0,200 Q200,120 450,200 Q550,150 600,180 L600,360 L0,360 Z" fill="#86EFAC" />
            <path d="M0,240 Q250,210 600,240 L600,360 L0,360 Z" fill="url(#grassGrad)" />

            {/* Playground Curved Slide */}
            <g transform="translate(80, 110)">
              {/* Tower Platform */}
              <rect x="40" y="30" width="70" height="80" rx="8" fill="#F59E0B" stroke="#B45309" strokeWidth="4" />
              {/* Roof */}
              <polygon points="30,35 75,-5 120,35" fill="#EF4444" stroke="#B91C1C" strokeWidth="3" />
              {/* Legs */}
              <rect x="45" y="110" width="10" height="90" fill="#92400E" />
              <rect x="95" y="110" width="10" height="90" fill="#92400E" />
              {/* Slide Ramp */}
              <path
                d="M 110,75 C 160,80 180,180 260,195"
                stroke="#3B82F6"
                strokeWidth="24"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 110,75 C 160,80 180,180 260,195"
                stroke="#60A5FA"
                strokeWidth="16"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Swings */}
            <g transform="translate(380, 120)">
              {/* Swing Frame A-shape */}
              <line x1="30" y1="180" x2="60" y2="20" stroke="#78350F" strokeWidth="8" strokeLinecap="round" />
              <line x1="90" y1="180" x2="60" y2="20" stroke="#78350F" strokeWidth="8" strokeLinecap="round" />
              <line x1="160" y1="180" x2="130" y2="20" stroke="#78350F" strokeWidth="8" strokeLinecap="round" />
              <line x1="45" y1="20" x2="145" y2="20" stroke="#78350F" strokeWidth="8" strokeLinecap="round" />
              {/* Swing ropes */}
              <line x1="85" y1="20" x2="85" y2="130" stroke="#64748B" strokeWidth="3" />
              <line x1="105" y1="20" x2="105" y2="130" stroke="#64748B" strokeWidth="3" />
              {/* Swing seat */}
              <rect x="75" y="130" width="40" height="10" rx="3" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
            </g>

            {/* Flowers on lawn */}
            <circle cx="80" cy="320" r="10" fill="#F43F5E" />
            <circle cx="80" cy="320" r="4" fill="#FDE047" />
            <circle cx="320" cy="310" r="10" fill="#A855F7" />
            <circle cx="320" cy="310" r="4" fill="#FDE047" />
          </g>
        )}

        {/* 7. SCENIC: ZOO SAFARI */}
        {scenicType === 'zoo_safari' && (
          <g>
            <rect width="600" height="360" fill="url(#skyGrad)" />
            <circle cx="100" cy="80" r="36" fill="url(#sunGrad)" filter="url(#softGlow)" />
            {/* Savanna rolling hills */}
            <path d="M0,210 Q250,150 600,210 L600,360 L0,360 Z" fill="#FDE047" opacity="0.6" />
            <path d="M0,240 Q300,220 600,240 L600,360 L0,360 Z" fill="url(#grassGrad)" />

            {/* Tall Acacia Tree */}
            <path d="M 460,260 Q 470,160 480,100" stroke="#78350F" strokeWidth="18" fill="none" strokeLinecap="round" />
            <ellipse cx="480" cy="90" rx="70" ry="25" fill="#15803D" />
            <ellipse cx="440" cy="80" rx="45" ry="20" fill="#16A34A" />
            <ellipse cx="510" cy="85" rx="45" ry="20" fill="#22C55E" />

            {/* Cute Giraffe Standing */}
            <g transform="translate(320, 100)">
              {/* Body */}
              <ellipse cx="50" cy="120" rx="45" ry="28" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
              {/* Long Neck */}
              <path d="M 25,115 Q 15,40 20,10" stroke="#F59E0B" strokeWidth="22" strokeLinecap="round" fill="none" />
              {/* Head */}
              <circle cx="15" cy="5" r="18" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
              <circle cx="10" cy="2" r="4" fill="#1E293B" />
              {/* Giraffe Spots */}
              <circle cx="20" cy="50" r="6" fill="#B45309" />
              <circle cx="18" cy="80" r="7" fill="#B45309" />
              <circle cx="45" cy="115" r="8" fill="#B45309" />
              <circle cx="65" cy="120" r="7" fill="#B45309" />
              {/* Legs */}
              <line x1="25" y1="145" x2="25" y2="200" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />
              <line x1="45" y1="145" x2="45" y2="200" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />
              <line x1="65" y1="145" x2="65" y2="200" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />
            </g>

            {/* Wooden Safety Railing */}
            <g transform="translate(0, 270)">
              <line x1="0" y1="20" x2="600" y2="20" stroke="#B45309" strokeWidth="8" />
              <line x1="0" y1="50" x2="600" y2="50" stroke="#B45309" strokeWidth="6" />
              {[30, 110, 190, 270, 350, 430, 510, 580].map((x) => (
                <rect key={x} x={x} y="0" width="12" height="75" rx="3" fill="#78350F" />
              ))}
            </g>
          </g>
        )}

        {/* 8. SCENIC: GUEST GREETING */}
        {scenicType === 'guest_greeting' && (
          <g>
            <rect width="600" height="360" fill="#FEF9C3" />
            {/* Living Room Floor */}
            <rect x="0" y="240" width="600" height="120" fill="#FBBF24" opacity="0.6" />

            {/* Living Room Doorway */}
            <rect x="70" y="60" width="120" height="200" rx="14" fill="#67E8F9" stroke="#0891B2" strokeWidth="6" />
            <polygon points="60,60 190,60 210,260 80,260" fill="#FFFFFF" opacity="0.15" />

            {/* Tea Table */}
            <rect x="260" y="200" width="240" height="70" rx="14" fill="url(#woodGrad)" stroke="#78350F" strokeWidth="4" />
            <rect x="290" y="270" width="16" height="60" fill="#92400E" />
            <rect x="460" y="270" width="16" height="60" fill="#92400E" />

            {/* Tea Tray with Steaming Cups */}
            <rect x="330" y="185" width="100" height="20" rx="5" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
            {/* Cup 1 */}
            <rect x="345" y="165" width="26" height="22" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
            <path d="M 358,158 Q 363,145 358,135" stroke="#94A3B8" strokeWidth="2" fill="none" />
            {/* Cup 2 */}
            <rect x="390" y="165" width="26" height="22" rx="4" fill="#F43F5E" stroke="#E11D48" strokeWidth="2" />
            <path d="M 403,158 Q 408,145 403,135" stroke="#94A3B8" strokeWidth="2" fill="none" />

            {/* Welcome banner on wall */}
            <rect x="300" y="50" width="170" height="50" rx="10" fill="#F59E0B" stroke="#D97706" strokeWidth="3" />
            <text x="385" y="82" fill="#FFFFFF" fontSize="16" fontWeight="900" textAnchor="middle">
              CHÀO QUÝ KHÁCH
            </text>
          </g>
        )}

        {/* 9. SCENIC: GIFT RECEIVING */}
        {scenicType === 'gift_receiving' && (
          <g>
            <rect width="600" height="360" fill="#FFF1F2" />
            {/* Celebration Confetti in Air */}
            <circle cx="80" cy="60" r="8" fill="#F43F5E" />
            <circle cx="160" cy="40" r="6" fill="#FBBF24" />
            <circle cx="480" cy="50" r="9" fill="#38BDF8" />
            <circle cx="530" cy="90" r="7" fill="#A855F7" />
            <circle cx="280" cy="30" r="8" fill="#10B981" />

            {/* Bunting flags */}
            <path d="M 0,40 Q 300,100 600,40" stroke="#CBD5E1" strokeWidth="2" fill="none" />
            {[50, 130, 210, 290, 370, 450, 530].map((x, idx) => (
              <polygon
                key={x}
                points={`${x},${45 + (idx % 2) * 10} ${x + 20},${45 + (idx % 2) * 10} ${x + 10},${75 + (idx % 2) * 10}`}
                fill={['#F43F5E', '#FBBF24', '#38BDF8', '#10B981', '#A855F7'][idx % 5]}
              />
            ))}

            {/* Giant Gift Box Centerpiece */}
            <g transform="translate(210, 130)">
              {/* Box Base */}
              <rect x="0" y="50" width="180" height="150" rx="18" fill="#E11D48" stroke="#9F1239" strokeWidth="4" />
              {/* Yellow Ribbon */}
              <rect x="75" y="50" width="30" height="150" fill="#FDE047" stroke="#F59E0B" strokeWidth="2" />
              <rect x="0" y="110" width="180" height="30" fill="#FDE047" stroke="#F59E0B" strokeWidth="2" />
              {/* Box Lid */}
              <rect x="-10" y="30" width="200" height="35" rx="10" fill="#F43F5E" stroke="#9F1239" strokeWidth="4" />
              <rect x="75" y="30" width="30" height="35" fill="#FDE047" />

              {/* Big Fluffy Bow */}
              <ellipse cx="60" cy="15" rx="30" ry="20" fill="#FDE047" stroke="#F59E0B" strokeWidth="3" />
              <ellipse cx="120" cy="15" rx="30" ry="20" fill="#FDE047" stroke="#F59E0B" strokeWidth="3" />
              <circle cx="90" cy="20" r="16" fill="#F59E0B" />
            </g>

            {/* Sparkling stars */}
            <path d="M 140,160 L 145,175 L 160,180 L 145,185 L 140,200 L 135,185 L 120,180 L 135,175 Z" fill="#FBBF24" />
            <path d="M 460,180 L 465,195 L 480,200 L 465,205 L 460,220 L 455,205 L 440,200 L 455,195 Z" fill="#FBBF24" />
          </g>
        )}

        {/* 10. SCENIC: APOLOGY & REPAIR */}
        {scenicType === 'apology_scene' && (
          <g>
            <rect width="600" height="360" fill="#ECFDF5" />
            {/* Living room floor */}
            <rect x="0" y="240" width="600" height="120" fill="#D1FAE5" />
            <line x1="0" y1="280" x2="600" y2="280" stroke="#A7F3D0" strokeWidth="2" />

            {/* Family Table */}
            <rect x="150" y="160" width="300" height="80" rx="16" fill="url(#woodGrad)" stroke="#78350F" strokeWidth="4" />
            <rect x="180" y="240" width="20" height="80" fill="#92400E" />
            <rect x="400" y="240" width="20" height="80" fill="#92400E" />

            {/* Spilled water cup & clean cloth */}
            <g transform="translate(240, 120)">
              {/* Tipped plastic cup */}
              <polygon points="40,30 80,10 90,40 50,60" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" rx="4" />
              {/* Clear Water Puddle */}
              <ellipse cx="110" cy="50" rx="40" ry="14" fill="#BAE6FD" opacity="0.8" />
              <ellipse cx="120" cy="52" rx="20" ry="6" fill="#FFFFFF" opacity="0.9" />

              {/* Colorful Cleaning Towel */}
              <rect x="130" y="32" width="45" height="30" rx="8" fill="#F43F5E" stroke="#BE185D" strokeWidth="2" />
              <circle cx="140" cy="42" r="3" fill="#FFFFFF" />
              <circle cx="160" cy="42" r="3" fill="#FFFFFF" />
              <circle cx="150" cy="52" r="3" fill="#FFFFFF" />
            </g>

            {/* Heart symbol of forgiveness & understanding */}
            <path
              d="M 300,60 C 300,45 280,35 265,50 C 250,35 230,45 230,60 C 230,85 265,100 265,110 C 265,100 300,85 300,60 Z"
              fill="#F43F5E"
              transform="translate(35, 10)"
            />
          </g>
        )}

        {/* Celebrating overlay particles */}
        {isCelebrating && (
          <g>
            {[
              { cx: 80, cy: 90, fill: '#FDE047' },
              { cx: 160, cy: 50, fill: '#F43F5E' },
              { cx: 280, cy: 40, fill: '#38BDF8' },
              { cx: 380, cy: 60, fill: '#10B981' },
              { cx: 480, cy: 40, fill: '#EC4899' },
              { cx: 540, cy: 110, fill: '#A855F7' },
            ].map((p, idx) => (
              <circle key={idx} cx={p.cx} cy={p.cy} r={8 + (idx % 3) * 3} fill={p.fill} />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
};
