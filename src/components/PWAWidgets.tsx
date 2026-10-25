import React, { useEffect, useState } from 'react';
import { Check, Copy, Download, Share2, Sparkles, Wifi, WifiOff, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

/**
 * Crisp inline SVG component rendering the official "ABC Vui Học" app icon
 * (Blue squircle, white speech bubble, yellow star, red-orange-green ABC, blue Vui Học)
 */
export const AppBrandLogo: React.FC<{ className?: string }> = ({
  className = 'w-9 h-9',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    className={`shrink-0 select-none ${className}`}
    role="img"
    aria-label="Logo ABC Vui Học"
  >
    <defs>
      <linearGradient id="brandBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2798FF" />
        <stop offset="100%" stopColor="#1574E2" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="1024" height="1024" rx="225" fill="url(#brandBlueGrad)" />
    <rect x="128" y="138" width="768" height="534" rx="185" fill="#FFFFFF" />
    <polygon
      points="274,648 228,822 426,668"
      fill="#FFFFFF"
      stroke="#FFFFFF"
      strokeWidth="6"
      strokeLinejoin="round"
    />
    <polygon
      points="824,48 842,96 893,98 852,130 867,179 824,150 781,179 796,130 755,98 806,96"
      fill="#FFCA28"
    />
    <g
      fontFamily="'Plus Jakarta Sans', 'Be Vietnam Pro', sans-serif"
      fontWeight="900"
      fontSize="214"
      textAnchor="middle"
    >
      <text x="352" y="420" fill="#FF585D" stroke="#FF585D" strokeWidth="12" strokeLinejoin="round">
        A
      </text>
      <text x="518" y="420" fill="#FFA800" stroke="#FFA800" strokeWidth="12" strokeLinejoin="round">
        B
      </text>
      <text x="678" y="420" fill="#18A957" stroke="#18A957" strokeWidth="12" strokeLinejoin="round">
        C
      </text>
    </g>
    <g fill="#1565D8" stroke="#1565D8" strokeLinejoin="round">
      <text
        x="512"
        y="568"
        textAnchor="middle"
        fontFamily="'Be Vietnam Pro', 'Plus Jakarta Sans', sans-serif"
        fontWeight="900"
        fontSize="144"
        strokeWidth="6"
        letterSpacing="2"
      >
        Vui Hoc
      </text>
      <rect x="641" y="586" width="24" height="22" rx="4" strokeWidth="2" />
    </g>
  </svg>
);

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: Boolean(deferredPrompt),
    isInstalled,
    isIOS,
    install,
  };
}

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.origin + '/' : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Vui Học – Sân chơi cho bé 0-5 tuổi',
          text: 'Sân chơi Tiếng Anh & Tư duy cho bé 0-5 tuổi (Dùng ngay không cần đăng nhập, hỗ trợ cả Offline):',
          url: shareUrl,
        });
        return;
      } catch {
        // user cancelled share
      }
    }
    handleCopyLink();
  };

  if (isInstalled) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (isInstallable) {
            install();
          } else {
            setShowModal(true);
          }
        }}
        className="min-h-[36px] sm:min-h-[40px] px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-[#1E88E5] hover:bg-[#1565C0] active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition whitespace-nowrap shrink-0 cursor-pointer"
        aria-label="Cài ứng dụng vào màn hình chính"
      >
        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        <span>Cài App</span>
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-guide-title"
        >
          <div className="w-full max-w-md rounded-[28px] bg-white p-5 sm:p-6 shadow-2xl border-2 border-sky-100 space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AppBrandLogo className="w-12 h-12 rounded-2xl shadow-sm" />
                <div>
                  <h3 id="pwa-guide-title" className="text-base sm:text-lg font-extrabold text-slate-900">
                    Cài "ABC Vui Học" Ra Màn Hình
                  </h3>
                  <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Mở là chơi ngay · Không cần đăng nhập
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 cursor-pointer"
                aria-label="Đóng hướng dẫn cài đặt"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct Link Box & Copy / Share */}
            <div className="p-3.5 rounded-2xl bg-sky-50/90 border border-sky-200 space-y-2.5">
              <div className="text-xs font-extrabold text-slate-700">
                Link truy cập & thêm ra màn hình chính (iPhone / iPad / Android / Máy tính):
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  aria-label="Đường dẫn ứng dụng"
                  className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white border border-sky-200 text-xs font-bold text-slate-700 select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[#1E88E5] hover:bg-[#1565C0] text-white text-xs font-extrabold flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã chép' : 'Chép Link'}</span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full min-h-[38px] px-3 py-1.5 rounded-xl bg-white hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Chia sẻ Link hoặc Thêm vào Màn hình chính</span>
              </button>
            </div>

            {/* Step-by-step instructions for iPhone/iPad & Android */}
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <div className="p-3.5 rounded-2xl bg-[#FFFDF5] border border-[#F3EFE0] space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>🍎</span> Trên iPhone / iPad (Trình duyệt Safari):
                </div>
                <ol className="space-y-1 text-xs text-slate-600 pl-1">
                  <li>
                    1. Mở link này trong <strong>Safari</strong> và chạm biểu tượng{' '}
                    <strong>Chia sẻ (Share ↑)</strong> ở thanh dưới cùng.
                  </li>
                  <li>
                    2. Cuộn xuống chọn <strong>"Thêm vào Màn hình chính" (Add to Home Screen)</strong>.
                  </li>
                  <li>
                    3. Biểu tượng <strong>ABC Vui Học</strong> sẽ hiện ngay ngoài màn hình như ứng dụng thật!
                  </li>
                </ol>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>🤖</span> Trên Điện thoại Samsung / Android & Máy tính:
                </div>
                <ol className="space-y-1 text-xs text-slate-600 pl-1">
                  <li>
                    1. Bấm dấu <strong>3 chấm (⋮)</strong> ở góc trên trình duyệt Chrome.
                  </li>
                  <li>
                    2. Chọn <strong>"Cài đặt ứng dụng"</strong> hoặc <strong>"Thêm vào Màn hình chính"</strong>.
                  </li>
                </ol>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-600 flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Hỗ trợ 100% cả <strong>Online & Offline</strong>. Khi có mạng, ứng dụng sẽ tự động cập nhật nội dung mới về máy mà không cần cài lại.
              </span>
            </div>

            {isIOS ? null : isInstallable ? (
              <button
                type="button"
                onClick={() => {
                  install();
                  setShowModal(false);
                }}
                className="w-full min-h-[46px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition cursor-pointer"
              >
                Cài đặt tự động ngay bây giờ
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full min-h-[44px] rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm transition cursor-pointer"
            >
              Đóng & Chơi Tiếp Ngay
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnectedToast, setShowReconnectedToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnectedToast(true);
      const t = setTimeout(() => setShowReconnectedToast(false), 3500);
      return () => clearTimeout(t);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnectedToast(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="fixed bottom-16 left-3 z-50 flex items-center gap-2 rounded-2xl bg-amber-500 px-3.5 py-2 text-xs font-extrabold text-white shadow-lg border border-amber-300">
        <WifiOff className="w-4 h-4 shrink-0" />
        <span>Chế độ Offline — Bé vẫn chơi & nghe phát âm bình thường không cần mạng!</span>
      </div>
    );
  }

  if (showReconnectedToast) {
    return (
      <div className="fixed bottom-16 left-3 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-3.5 py-2 text-xs font-extrabold text-white shadow-lg border border-emerald-400">
        <Wifi className="w-4 h-4 shrink-0" />
        <span>Đã kết nối mạng — Tự động đồng bộ & cập nhật phiên bản mới nhất!</span>
      </div>
    );
  }

  return null;
};
