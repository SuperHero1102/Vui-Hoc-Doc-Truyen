import React, { useEffect, useRef, useState } from 'react';
import {
  Lock,
  ShieldCheck,
  Volume2,
  Clock,
  BarChart3,
  HeartHandshake,
  Code2,
  X,
  RotateCcw,
  Mic,
  CheckCircle2,
  Power,
  KeyRound,
  Eye,
  EyeOff,
  BookOpen,
} from 'lucide-react';
import type {
  AgeGroupId,
  LearningProgress,
  ParentSettings,
  TopicLesson,
} from '../types/learning';
import {
  AGE_GROUPS,
  generateParentMathChallenge,
  verifyParentMathAnswer,
  verifyParentPassword,
} from '../utils/learningLogic';
import { getClientAudioCacheSize, speakTeacherVoice } from '../utils/audioEngine';

interface ParentGateModalProps {
  isOpen: boolean;
  parentPin?: string;
  onClose: () => void;
  onUnlocked: () => void;
}

export const ParentGateModal: React.FC<ParentGateModalProps> = ({
  isOpen,
  parentPin,
  onClose,
  onUnlocked,
}) => {
  const hasCustomPin = Boolean(parentPin && parentPin.trim().length > 0);
  const [challenge, setChallenge] = useState(() => generateParentMathChallenge(101));
  const [answerInput, setAnswerInput] = useState('');
  const [hintMessage, setHintMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [useMathRecovery, setUseMathRecovery] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setChallenge(generateParentMathChallenge(Date.now()));
      setAnswerInput('');
      setHintMessage('');
      setHoldProgress(0);
      setUseMathRecovery(false);
    }
    return () => {
      if (holdTimerRef.current) window.clearInterval(holdTimerRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasCustomPin && !useMathRecovery) {
      if (verifyParentPassword(parentPin, answerInput)) {
        onUnlocked();
      } else {
        setHintMessage('Mã PIN / Mật khẩu chưa đúng, bố mẹ vui lòng nhập lại nhé!');
        setAnswerInput('');
      }
      return;
    }

    if (verifyParentMathAnswer(challenge, answerInput)) {
      onUnlocked();
    } else {
      setHintMessage('Chưa đúng phép tính, bố mẹ thử lại nhé!');
      setAnswerInput('');
    }
  };

  const startHoldUnlock = () => {
    if (hasCustomPin) return;
    if (holdTimerRef.current) window.clearInterval(holdTimerRef.current);
    const startTime = Date.now();
    holdTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / 3000) * 100));
      setHoldProgress(pct);
      if (pct >= 100) {
        if (holdTimerRef.current) window.clearInterval(holdTimerRef.current);
        onUnlocked();
      }
    }, 60);
  };

  const stopHoldUnlock = () => {
    if (holdTimerRef.current) {
      window.clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setHoldProgress(0);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="parent-gate-title"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border-2 border-sky-200 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 id="parent-gate-title" className="text-lg font-extrabold text-slate-900">
                Khóa An Toàn Khu Vực Phụ Huynh
              </h2>
              <p className="text-xs text-slate-500">
                {hasCustomPin
                  ? 'Nhập Mã PIN / Mật khẩu riêng của bố mẹ để mở khóa'
                  : 'Ngăn bé vô tình bấm nhầm vào phần cài đặt'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
            aria-label="Đóng khóa phụ huynh"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleUnlockSubmit}
          className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200"
        >
          {hasCustomPin && !useMathRecovery ? (
            <>
              <div className="flex items-center justify-between">
                <label htmlFor="parent-pin-input" className="block text-sm font-bold text-slate-800">
                  Nhập Mã PIN hoặc Mật khẩu của Bố Mẹ:
                </label>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  ⚡ Tự động mở khi nhập đúng
                </span>
              </div>
              <div className="relative">
                <input
                  id="parent-pin-input"
                  type={showPassword ? 'text' : 'password'}
                  value={answerInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAnswerInput(val);
                    setHintMessage('');
                    if (verifyParentPassword(parentPin, val)) {
                      onUnlocked();
                    }
                  }}
                  autoFocus
                  placeholder="Nhập mã PIN / mật khẩu..."
                  className="w-full min-h-[48px] pl-4 pr-10 rounded-xl border border-slate-300 bg-white text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <label htmlFor="parent-math-input" className="block text-sm font-bold text-slate-800">
                  Giải phép tính: <span className="text-sky-700 font-extrabold text-base">{challenge.questionText}</span>
                </label>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  ⚡ Tự động mở khi nhập đúng
                </span>
              </div>
              <input
                id="parent-math-input"
                type="number"
                inputMode="numeric"
                value={answerInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setAnswerInput(val);
                  setHintMessage('');
                  if (verifyParentMathAnswer(challenge, val)) {
                    onUnlocked();
                  }
                }}
                autoFocus
                placeholder="Nhập kết quả phép tính..."
                className="w-full min-h-[48px] px-4 rounded-xl border border-slate-300 bg-white text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
              />
            </>
          )}
          {hintMessage && <p className="text-xs font-semibold text-rose-600">{hintMessage}</p>}
        </form>

        {!hasCustomPin && (
          <div className="text-center space-y-2">
            <div className="text-xs text-slate-500 font-medium">
              Hoặc nhấn giữ nút dưới đây trong 3 giây (Bố mẹ có thể cài mật khẩu riêng bên trong)
            </div>
            <button
              type="button"
              onMouseDown={startHoldUnlock}
              onMouseUp={stopHoldUnlock}
              onMouseLeave={stopHoldUnlock}
              onTouchStart={startHoldUnlock}
              onTouchEnd={stopHoldUnlock}
              className="w-full min-h-[48px] rounded-2xl border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm relative overflow-hidden cursor-pointer select-none"
            >
              <div
                className="absolute inset-y-0 left-0 bg-sky-200/70 transition-all"
                style={{ width: `${holdProgress}%` }}
              />
              <span className="relative z-10">
                {holdProgress > 0 ? `Đang giữ... ${holdProgress}%` : 'Giữ 3 giây để mở nhanh'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface ScreenTimeLockModalProps {
  isOpen: boolean;
  childName: string;
  todayMinutesPlayed: number;
  dailyLimitMinutes: number;
  parentPin?: string;
  onExtendTime: (extraMinutes: number) => void;
  onDisableAutoOff: () => void;
}

export const ScreenTimeLockModal: React.FC<ScreenTimeLockModalProps> = ({
  isOpen,
  childName,
  todayMinutesPlayed,
  dailyLimitMinutes,
  parentPin,
  onExtendTime,
  onDisableAutoOff,
}) => {
  const hasCustomPin = Boolean(parentPin && parentPin.trim().length > 0);
  const [challenge, setChallenge] = useState(() => generateParentMathChallenge(202));
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setChallenge(generateParentMathChallenge(Date.now()));
      setPasswordInput('');
      setErrorMsg('');
      setIsUnlocked(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerifyParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyParentPassword(parentPin, passwordInput, challenge)) {
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg(
        hasCustomPin
          ? 'Mật khẩu / Mã PIN của bố mẹ chưa đúng! Vui lòng thử lại.'
          : 'Mật khẩu xác minh chưa đúng! Bố mẹ vui lòng kiểm tra lại.'
      );
      setPasswordInput('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="eye-rest-title"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl border-3 border-amber-300 space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
          🐥
        </div>

        <div>
          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            ⏰ Hết giờ chơi hôm nay
          </span>
          <h2 id="eye-rest-title" className="text-xl font-extrabold text-slate-900 mt-2">
            Đến giờ cho đôi mắt của {childName} nghỉ ngơi rồi!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed tabular-nums mt-1">
            Hôm nay {childName} đã dùng <strong>{todayMinutesPlayed} phút</strong> (Giới hạn cài đặt:{' '}
            <strong>{dailyLimitMinutes} phút</strong>).
          </p>
        </div>

        {!isUnlocked ? (
          <form
            onSubmit={handleVerifyParent}
            className="text-left bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs sm:text-sm">
                <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {hasCustomPin
                    ? 'Nhập Mã PIN / Mật khẩu của Bố Mẹ:'
                    : `Nhập mật khẩu xác minh (${challenge.questionText}):`}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                ⚡ Tự động mở
              </span>
            </div>

            <div className="relative">
              <input
                id="screen-time-parent-password"
                type={hasCustomPin && !showPassword ? 'password' : 'text'}
                value={passwordInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setPasswordInput(val);
                  setErrorMsg('');
                  if (verifyParentPassword(parentPin, val, challenge)) {
                    setIsUnlocked(true);
                  }
                }}
                autoFocus
                placeholder={
                  hasCustomPin
                    ? 'Nhập mật khẩu / mã PIN của bố mẹ...'
                    : `Nhập đáp án (${challenge.questionText})...`
                }
                className="w-full min-h-[48px] pl-4 pr-10 rounded-xl border border-slate-300 bg-white text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
              />
              {hasCustomPin && (
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>

            {errorMsg && <p className="text-xs font-bold text-rose-600">{errorMsg}</p>}

            <p className="text-[11px] text-slate-500">
              * Bé không thể tự bấm chơi tiếp nếu không có mật khẩu của bố mẹ.
            </p>
          </form>
        ) : (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 space-y-3">
            <div className="text-xs sm:text-sm font-extrabold text-emerald-900 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã xác minh mật khẩu Bố Mẹ! Bố mẹ chọn chế độ cho bé:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onExtendTime(15)}
                className="min-h-[44px] px-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm cursor-pointer"
              >
                +15 phút dùng tiếp
              </button>
              <button
                type="button"
                onClick={onDisableAutoOff}
                className="min-h-[44px] px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm cursor-pointer"
              >
                Tắt giới hạn thời gian
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ParentDashboardProps {
  settings: ParentSettings;
  progress: LearningProgress;
  topics: TopicLesson[];
  onUpdateSettings: (next: ParentSettings) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  settings,
  progress,
  topics,
  onUpdateSettings,
  onResetProgress,
  onClose,
}) => {
  const [ttsStatusMsg, setTtsStatusMsg] = useState<string>('');
  const [serverTtsInfo, setServerTtsInfo] = useState<{
    available: boolean;
    cachedCount: number;
  } | null>(null);

  // Parent PIN / Password configuration state
  const [newPin, setNewPin] = useState(settings.parentPin || '');
  const [confirmPin, setConfirmPin] = useState(settings.parentPin || '');
  const [showPinText, setShowPinText] = useState(false);
  const [pinFeedback, setPinFeedback] = useState<{ text: string; type: 'ok' | 'err' } | null>(
    null
  );

  useEffect(() => {
    fetch('/api/tts/status')
      .then((r) => r.json())
      .then((data) => setServerTtsInfo(data))
      .catch(() => {});
  }, []);

  const learnedList = Object.values(progress.wordsLearned);

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPin.trim();
    if (trimmed.length < 3) {
      setPinFeedback({
        text: 'Mã PIN hoặc mật khẩu cần có ít nhất 3 ký tự!',
        type: 'err',
      });
      return;
    }
    if (trimmed !== confirmPin.trim()) {
      setPinFeedback({
        text: 'Mật khẩu nhập lại chưa khớp, bố mẹ kiểm tra lại nhé!',
        type: 'err',
      });
      return;
    }
    onUpdateSettings({
      ...settings,
      parentPin: trimmed,
    });
    setPinFeedback({
      text: 'Đã lưu Mã PIN / Mật khẩu riêng của Bố Mẹ thành công!',
      type: 'ok',
    });
  };

  const handleRemovePin = () => {
    setNewPin('');
    setConfirmPin('');
    onUpdateSettings({
      ...settings,
      parentPin: '',
    });
    setPinFeedback({
      text: 'Đã xóa mật khẩu riêng và chuyển về chế độ phép tính mặc định.',
      type: 'ok',
    });
  };

  const handleTestVoice = async () => {
    setTtsStatusMsg('Đang phát thử giọng cô giáo miền Bắc + phát âm tiếng Anh bản xứ...');
    const result = await speakTeacherVoice(
      [
        {
          lang: 'vi',
          text: 'Chào bố mẹ và bé ơi! Phần tiếng Việt do cô giáo miền Bắc đọc ấm áp, rõ chữ.',
        },
        {
          lang: 'en',
          text: 'Apple! Red apple! I like sweet apples.',
        },
        {
          lang: 'vi',
          text: 'Quả táo đỏ giòn tan!',
        },
      ],
      settings
    );
    if (result.usedGemini) {
      setTtsStatusMsg(
        result.fromCache
          ? 'Đã phát từ bộ nhớ đệm (Cache) siêu mượt (Tách biệt giọng Việt Bắc Bộ & giọng Anh bản xứ)!'
          : 'Đã phát giọng Cô giáo miền Bắc + Tiếng Anh chuẩn bản xứ và lưu vào bộ nhớ đệm!'
      );
    } else {
      setTtsStatusMsg('Đã phát bằng giọng đọc tích hợp trên thiết bị.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-3xl bg-slate-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold">
              Khu Vực Dành Cho Phụ Huynh
            </h1>
            <p className="text-xs text-slate-300">
              Cài đặt Mã PIN/Mật khẩu riêng, giới hạn thời gian, giọng đọc và theo dõi tiến độ của bé
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="min-h-[44px] px-4 py-2 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs sm:text-sm cursor-pointer"
        >
          Quay lại Sân chơi của bé
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* 1. Custom Parent PIN / Password Setup */}
          <section className="rounded-3xl bg-white border-2 border-amber-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-600" />
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                  1. Cài đặt Mã PIN / Mật khẩu riêng của Bố Mẹ
                </h2>
              </div>
              <span
                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-lg ${
                  settings.parentPin
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {settings.parentPin ? '🔒 Đã bật mật khẩu riêng' : 'Chưa đặt mật khẩu riêng'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Mật khẩu này dùng để mở Khu vực Phụ huynh và{' '}
              <strong>mở khóa khi bé hết thời gian chơi</strong> (ngăn bé tự bấm chơi tiếp khi hết giờ).
            </p>

            <form onSubmit={handleSavePin} className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="new-parent-pin" className="block text-xs font-bold text-slate-700 mb-1">
                    Mã PIN / Mật khẩu mới:
                  </label>
                  <div className="relative">
                    <input
                      id="new-parent-pin"
                      type={showPinText ? 'text' : 'password'}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="VD: 1234 hoặc matkhau..."
                      className="w-full min-h-[42px] pl-3 pr-9 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPinText((v) => !v)}
                      aria-label={showPinText ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showPinText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirm-parent-pin"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Nhập lại Mã PIN / Mật khẩu:
                  </label>
                  <input
                    id="confirm-parent-pin"
                    type={showPinText ? 'text' : 'password'}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="Nhập lại để xác nhận..."
                    className="w-full min-h-[42px] px-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm cursor-pointer"
                >
                  Lưu Mã PIN / Mật khẩu
                </button>
                {settings.parentPin && (
                  <button
                    type="button"
                    onClick={handleRemovePin}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs cursor-pointer"
                  >
                    Gỡ mật khẩu riêng
                  </button>
                )}
              </div>

              {pinFeedback && (
                <p
                  className={`text-xs font-bold flex items-center gap-1.5 ${
                    pinFeedback.type === 'ok' ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{pinFeedback.text}</span>
                </p>
              )}
            </form>
          </section>

          {/* 2. Age Group Selector */}
          <section className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm space-y-3">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              2. Chọn nhóm độ tuổi của bé
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AGE_GROUPS.map((group) => {
                const isSelected = settings.selectedAge === group.id;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() =>
                      onUpdateSettings({
                        ...settings,
                        selectedAge: group.id as AgeGroupId,
                        dailyLimitMinutes: group.recommendedDailyLimitMins,
                      })
                    }
                    className={`p-2.5 rounded-2xl border-2 text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/80 text-sky-950'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="font-extrabold text-xs sm:text-sm">{group.label}</div>
                    <div className="text-[11px] text-slate-600">{group.stageTitle}</div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. Northern Vietnamese Voice & Native English Settings */}
          <section className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-sky-600" />
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                  3. Giọng đọc Cô giáo Miền Bắc (Hà Nội) & Tiếng Anh Bản Xứ
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500 tabular-nums">
                Đã lưu đệm: {(serverTtsInfo?.cachedCount || 0) + getClientAudioCacheSize()} câu
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Hệ thống tự động <strong>tách riêng từng đoạn tiếng Việt và tiếng Anh</strong>: phần tiếng Việt luôn do giọng nữ miền Bắc Việt Nam đọc, phần từ vựng tiếng Anh do giọng bản xứ đọc chuẩn.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'Kore' as const, label: 'Cô Mai (Hà Nội)', desc: 'Ấm áp, dịu dàng, chuẩn mẫu' },
                { id: 'Zephyr' as const, label: 'Cô Lan (Hà Nội)', desc: 'Tươi vui, trong trẻo' },
                { id: 'Puck' as const, label: 'Cô Hương (Kể chuyện)', desc: 'Sinh động, truyền cảm' },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, voicePersona: v.id })}
                  className={`p-2.5 rounded-2xl border-2 text-left cursor-pointer ${
                    settings.voicePersona === v.id
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm text-slate-900">{v.label}</div>
                  <div className="text-[11px] text-slate-600">{v.desc}</div>
                </button>
              ))}
            </div>

            {/* English Accent Selection: American vs British English */}
            <div className="pt-1">
              <span className="block text-xs font-bold text-slate-700 mb-1.5">
                Chuẩn phát âm tiếng Anh cho bé:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, englishAccent: 'en-US' })}
                  className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-bold border transition text-left flex items-center justify-between cursor-pointer ${
                    (settings.englishAccent || 'en-US') === 'en-US'
                      ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="font-extrabold">🇺🇸 Tiếng Anh - Mỹ (US)</div>
                    <div className={`text-[10px] ${(settings.englishAccent || 'en-US') === 'en-US' ? 'text-sky-100' : 'text-slate-500'}`}>
                      Âm sắc rõ, phổ biến toàn cầu
                    </div>
                  </div>
                  {(settings.englishAccent || 'en-US') === 'en-US' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, englishAccent: 'en-GB' })}
                  className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-bold border transition text-left flex items-center justify-between cursor-pointer ${
                    settings.englishAccent === 'en-GB'
                      ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="font-extrabold">🇬🇧 Tiếng Anh - Anh (UK)</div>
                    <div className={`text-[10px] ${settings.englishAccent === 'en-GB' ? 'text-sky-100' : 'text-slate-500'}`}>
                      Chuẩn giọng Hoàng gia (RP)
                    </div>
                  </div>
                  {settings.englishAccent === 'en-GB' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tốc độ đọc:
                </span>
                <div className="flex gap-1.5">
                  {[
                    { id: 'slow' as const, label: 'Chậm rõ' },
                    { id: 'normal' as const, label: 'Vừa phải' },
                    { id: 'fast' as const, label: 'Tự nhiên' },
                  ].map((sp) => (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => onUpdateSettings({ ...settings, voiceSpeed: sp.id })}
                      className={`flex-1 min-h-[38px] px-2 py-1 rounded-xl text-xs font-bold border cursor-pointer ${
                        settings.voiceSpeed === sp.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {sp.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="volume-slider"
                  className="block text-xs font-bold text-slate-700 mb-1.5 tabular-nums"
                >
                  Âm lượng: {Math.round(settings.volume * 100)}%
                </label>
                <input
                  id="volume-slider"
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={settings.volume}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, volume: parseFloat(e.target.value) })
                  }
                  className="w-full accent-sky-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleTestVoice}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe thử giọng Việt (Bắc Bộ) + Tiếng Anh</span>
              </button>
            </div>

            {ttsStatusMsg && (
              <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{ttsStatusMsg}</span>
              </p>
            )}
          </section>

          {/* 4. Toggleable Auto-Off Timer & Adjustable Duration */}
          <section className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                  4. Chế độ Tự tắt nghỉ mắt & Điều chỉnh thời gian
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({ ...settings, autoOffEnabled: !settings.autoOffEnabled })
                }
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                  settings.autoOffEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>Chế độ Tự tắt: {settings.autoOffEnabled ? 'ĐANG BẬT' : 'ĐÃ TẮT'}</span>
              </button>
            </div>

            {settings.autoOffEnabled ? (
              <div className="space-y-3">
                <span className="block text-xs font-bold text-slate-700">
                  Chọn nhanh hoặc nhập số phút nhắc nghỉ mắt tùy ý (Đang cài:{' '}
                  <strong className="text-amber-700">{settings.dailyLimitMinutes} phút</strong>):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 3, 5, 10, 15, 20, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => onUpdateSettings({ ...settings, dailyLimitMinutes: mins })}
                      className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold border tabular-nums cursor-pointer ${
                        settings.dailyLimitMinutes === mins
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {mins} phút
                    </button>
                  ))}
                </div>

                {/* Direct numeric input for custom minutes */}
                <div className="flex flex-wrap items-center gap-2 bg-amber-50/70 border border-amber-200 rounded-2xl p-2.5">
                  <label
                    htmlFor="custom-eye-rest-minutes"
                    className="text-xs font-extrabold text-slate-800"
                  >
                    Nhập số phút tùy ý:
                  </label>
                  <input
                    id="custom-eye-rest-minutes"
                    type="number"
                    min={1}
                    max={300}
                    value={settings.dailyLimitMinutes}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!Number.isNaN(val) && val >= 1) {
                        onUpdateSettings({
                          ...settings,
                          dailyLimitMinutes: Math.min(300, val),
                        });
                      }
                    }}
                    className="w-24 min-h-[38px] px-3 rounded-xl border border-amber-300 bg-white text-sm font-extrabold text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-700">phút (từ 1 đến 300 phút)</span>
                </div>

                <input
                  type="range"
                  min={1}
                  max={120}
                  step={1}
                  value={Math.min(120, settings.dailyLimitMinutes)}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      dailyLimitMinutes: parseInt(e.target.value, 10),
                    })
                  }
                  aria-label="Thanh trượt chỉnh số phút tự tắt"
                  className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            ) : (
              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                Chế độ Tự tắt đang được <strong>TẮT</strong>. Màn hình sẽ không bị giới hạn thời gian khi bé học cùng bố mẹ.
              </p>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-start gap-2">
                <Mic className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div className="text-xs font-bold text-slate-800">
                  Cho phép bật Micro trong trò "Nhại giọng theo cô" (Không lưu âm thanh)
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.allowMicrophone}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, allowMicrophone: e.target.checked })
                }
                aria-label="Cho phép bật Micro"
                className="w-5 h-5 rounded accent-purple-600 cursor-pointer"
              />
            </div>
          </section>

          {/* 5. Story Reading Settings */}
          <section className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                5. Cài đặt Mục Đọc Truyện Cho Bé
              </h2>
            </div>

            <p className="text-xs text-slate-600">
              Chọn ngôn ngữ đọc truyện và hiệu ứng lồng tiếng giả giọng nhân vật cho bé.
            </p>

            <div>
              <span className="block text-xs font-bold text-slate-700 mb-1.5">
                Ngôn ngữ đọc truyện:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'vi' as const, label: '🇻🇳 Tiếng Việt', desc: 'Giọng kể thuần Việt' },
                  { id: 'en' as const, label: '🇬🇧 Tiếng Anh', desc: 'English Only' },
                  { id: 'bilingual' as const, label: '🌐 Song Ngữ', desc: 'Anh & Việt song song' },
                ].map((item) => {
                  const isSelected = (settings.storyLanguage || 'bilingual') === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        onUpdateSettings({ ...settings, storyLanguage: item.id })
                      }
                      className={`min-h-[46px] p-2 rounded-xl text-left border transition cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-extrabold shadow-2xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-xs">{item.label}</div>
                      <div className="text-[10px] text-slate-500">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-start gap-2">
                <span className="text-base">🎭</span>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Giả giọng sinh động theo từng nhân vật
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Sói giọng trầm, thỏ & heo con giọng non nớt, tiên ông ấm áp...
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.characterVoices !== false}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, characterVoices: e.target.checked })
                }
                aria-label="Giả giọng theo nhân vật"
                className="w-5 h-5 rounded accent-indigo-600 cursor-pointer"
              />
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-4">
          <section className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Tiến độ học tập của bé (256 từ / 32 chủ đề)
                </h2>
              </div>
              <button
                type="button"
                onClick={onResetProgress}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Đặt lại
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-2.5 rounded-2xl bg-sky-50 border border-sky-100">
                <div className="text-xl font-extrabold text-sky-900 tabular-nums">
                  {learnedList.length}/256
                </div>
                <div className="text-[11px] text-slate-600">Từ đã học</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="text-xl font-extrabold text-amber-900 tabular-nums">
                  {progress.completedTopics.length}/{topics.length}
                </div>
                <div className="text-[11px] text-slate-600">Chủ đề</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                <div className="text-xl font-extrabold text-emerald-900 tabular-nums">
                  {settings.autoOffEnabled
                    ? `${progress.todayMinutesPlayed}/${settings.dailyLimitMinutes}p`
                    : `${progress.todayMinutesPlayed}p`}
                </div>
                <div className="text-[11px] text-slate-600">Hôm nay</div>
              </div>
            </div>

            {learnedList.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                {learnedList.slice(0, 16).map((w) => (
                  <span
                    key={w.wordId}
                    className="text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-lg tabular-nums"
                  >
                    {w.emoji} <strong>{w.en}</strong> ({w.vi})
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Bé chưa chạm từ nào hôm nay. Hãy mở một chủ đề và cùng bé khám phá nhé!
              </p>
            )}
          </section>

          <section className="rounded-3xl bg-amber-50 border border-amber-200 p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-950 font-extrabold text-xs sm:text-sm">
              <HeartHandshake className="w-4 h-4 text-amber-700 shrink-0" />
              <span>An toàn & Hoạt động ngoài đời thật</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Không quảng cáo, không thu thập dữ liệu. Trẻ dưới 2 tuổi luôn cần bố mẹ ngồi cùng. Khi học xong mỗi chủ đề, bố mẹ hãy chỉ vào đồ vật thật quanh nhà và đố bé gọi tên tiếng Anh nhé!
            </p>
          </section>

          <section className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm space-y-1.5">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-sky-600" />
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-900">
                Kho dữ liệu 32 Chủ đề × 8 Từ vựng (256 từ)
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tất cả 32 chủ đề trong <code>src/data/lessonsData.json</code> đã được trang bị đầy đủ 8 từ/chủ đề, câu mẫu theo 6 lứa tuổi và 4 câu hát vần điệu.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
