import React from 'react';
import { X, Star, Award, Volume2 } from 'lucide-react';
import type { LearningProgress, ParentSettings, TopicLesson } from '../types/learning';
import { speakTeacherVoice } from '../utils/audioEngine';

interface StickerAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: TopicLesson[];
  progress: LearningProgress;
  settings: ParentSettings;
  onSelectTopic: (topic: TopicLesson) => void;
}

export const StickerAlbumModal: React.FC<StickerAlbumModalProps> = ({
  isOpen,
  onClose,
  topics,
  progress,
  settings,
  onSelectTopic,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sticker-album-title"
    >
      <div className="w-full max-w-3xl rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border-2 border-amber-200 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h2 id="sticker-album-title" className="text-xl font-extrabold text-slate-900">
                Album Sticker & Nhân Vật Của Bé
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 tabular-nums">
                Đã sưu tầm: {progress.unlockedStickers.length}/{topics.length} Sticker · {progress.stars} Ngôi sao vàng
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
            aria-label="Đóng Album Sticker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 overflow-y-auto pr-1 space-y-5">
          {/* Mascot Friends Row */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 mb-2.5">
              Các bạn nhỏ dẫn chuyện (Chạm để nghe lời chào):
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {topics.slice(0, 8).map((t) => (
                <button
                  key={t.narrator.id}
                  type="button"
                  onClick={() => speakTeacherVoice(t.narrator.greetingVi, settings)}
                  className="p-3 rounded-2xl border border-sky-100 bg-sky-50/60 hover:bg-sky-100/70 flex flex-col items-center text-center transition cursor-pointer"
                >
                  <span className="text-4xl">{t.narrator.emoji}</span>
                  <span className="text-xs font-extrabold text-slate-900 mt-1.5">
                    {t.narrator.name}
                  </span>
                  <span className="text-[11px] text-sky-700 font-semibold mt-0.5 flex items-center gap-1">
                    <Volume2 className="w-3 h-3" /> Nghe chào
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* All 28 Stickers */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 mb-2.5">
              Bộ sưu tập 28 Huy hiệu Thế giới Từ vựng:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {topics.map((t) => {
                const isUnlocked = progress.unlockedStickers.includes(t.rewardSticker.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectTopic(t);
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-center flex flex-col items-center justify-center transition cursor-pointer ${
                      isUnlocked
                        ? 'bg-amber-50 border-amber-300 shadow-sm'
                        : 'bg-slate-50 border-slate-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <span className="text-4xl">{isUnlocked ? t.rewardSticker.emoji : '⭐'}</span>
                    <span className="text-xs font-extrabold text-slate-900 mt-1.5">
                      {t.rewardSticker.nameVi}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      {isUnlocked ? 'Đã nhận thưởng!' : 'Chạm để vào học'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-amber-600 font-extrabold text-sm tabular-nums">
            <Star className="w-5 h-5 fill-amber-400" />
            <span>Tổng sao của bé: {progress.stars}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm cursor-pointer"
          >
            Quay lại sân chơi
          </button>
        </div>
      </div>
    </div>
  );
};
