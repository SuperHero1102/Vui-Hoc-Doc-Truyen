import React, { useState } from 'react';
import { Check, Plus, Trash2, UserPlus, Users, X, Star, Award, BookOpen } from 'lucide-react';
import type { AgeGroupId, ChildProfile } from '../types/learning';
import { AGE_GROUPS, getAgeGroupConfig } from '../utils/learningLogic';

interface ProfileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: ChildProfile[];
  activeProfileId: string;
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: (name: string, avatarEmoji: string, avatarBg: string, ageId: AgeGroupId) => void;
  onDeleteProfile: (profileId: string) => void;
}

const AVATAR_OPTIONS = [
  { emoji: '🐥', bg: '#FEF08A' },
  { emoji: '🐰', bg: '#FBCFE8' },
  { emoji: '🐻', bg: '#FDE68A' },
  { emoji: '🐼', bg: '#E0F2FE' },
  { emoji: '🦊', bg: '#FED7AA' },
  { emoji: '🦁', bg: '#FEF3C7' },
  { emoji: '🐨', bg: '#E2E8F0' },
  { emoji: '🐯', bg: '#FFEDD5' },
  { emoji: '🦄', bg: '#F3E8FF' },
  { emoji: '🐬', bg: '#BAE6FD' },
  { emoji: '🍓', bg: '#FFE4E6' },
  { emoji: '🚀', bg: '#DDD6FE' },
];

export const ProfileManagerModal: React.FC<ProfileManagerModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [selectedAge, setSelectedAge] = useState<AgeGroupId>('2-3y');

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim() || `Bé Yêu ${profiles.length + 1}`;
    onCreateProfile(trimmed, selectedAvatar.emoji, selectedAvatar.bg, selectedAge);
    setNewName('');
    setIsCreating(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-manager-title"
    >
      <div className="w-full max-w-2xl max-h-[90dvh] overflow-y-auto rounded-3xl bg-white p-4 sm:p-6 shadow-2xl border-4 border-sky-200 space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 id="profile-manager-title" className="text-lg sm:text-xl font-extrabold text-slate-900">
                Hồ Sơ Các Bé (Nhiều Người Dùng)
              </h2>
              <p className="text-xs text-slate-500">
                Mỗi bé có độ tuổi, bộ sưu tập Sticker và tiến độ từ vựng lưu riêng biệt
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer shrink-0"
            aria-label="Đóng quản lý hồ sơ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of existing child profiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {profiles.map((profile) => {
            const isActive = profile.id === activeProfileId;
            const ageCfg = getAgeGroupConfig(profile.ageId);
            const learnedWordsCount = Object.keys(profile.progress.wordsLearned).length;

            return (
              <div
                key={profile.id}
                onClick={() => {
                  onSelectProfile(profile.id);
                  onClose();
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectProfile(profile.id);
                    onClose();
                  }
                }}
                className={`rounded-3xl p-4 border-3 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isActive
                    ? 'border-sky-500 bg-sky-50/70 shadow-md ring-2 ring-sky-200'
                    : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border-2 border-white shrink-0"
                      style={{ backgroundColor: profile.avatarBg }}
                    >
                      {profile.avatarEmoji}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-extrabold text-slate-900 truncate">
                          {profile.name}
                        </h3>
                        {isActive && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-sky-500 text-white text-[10px] font-extrabold shrink-0">
                            <Check className="w-3 h-3" /> Đang học
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-sky-700 mt-0.5">
                        {ageCfg.label} · {ageCfg.stageTitle}
                      </div>
                    </div>
                  </div>

                  {profiles.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProfile(profile.id);
                      }}
                      className="w-8 h-8 rounded-xl hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition cursor-pointer shrink-0"
                      aria-label={`Xóa hồ sơ ${profile.name}`}
                      title="Xóa hồ sơ này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-200/70 text-center">
                  <div className="rounded-xl bg-amber-50 px-2 py-1">
                    <div className="text-xs font-extrabold text-amber-700 flex items-center justify-center gap-1 tabular-nums">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      {profile.progress.stars}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500">Ngôi sao</div>
                  </div>

                  <div className="rounded-xl bg-emerald-50 px-2 py-1">
                    <div className="text-xs font-extrabold text-emerald-700 flex items-center justify-center gap-1 tabular-nums">
                      <Award className="w-3 h-3 text-emerald-600" />
                      {profile.progress.unlockedStickers.length}/28
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500">Sticker</div>
                  </div>

                  <div className="rounded-xl bg-sky-50 px-2 py-1">
                    <div className="text-xs font-extrabold text-sky-700 flex items-center justify-center gap-1 tabular-nums">
                      <BookOpen className="w-3 h-3 text-sky-600" />
                      {learnedWordsCount}/224
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500">Từ đã học</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add new profile form or trigger button */}
        {!isCreating ? (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="w-full min-h-[48px] rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/50 hover:bg-sky-100/60 text-sky-700 font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <UserPlus className="w-5 h-5" />
            <span>+ Thêm hồ sơ bé mới (Dành cho gia đình nhiều bé / lớp mầm non)</span>
          </button>
        ) : (
          <form
            onSubmit={handleCreateSubmit}
            className="rounded-3xl bg-slate-50 border-2 border-sky-200 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-sky-600" />
                Tạo hồ sơ bé mới
              </h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Hủy
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên thân mật của bé:
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ví dụ: Bé Bông, Bé Bin, Bé Sóc..."
                maxLength={24}
                className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm font-bold text-slate-900 focus:border-sky-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chọn hình đại diện yêu thích:
              </label>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av.emoji}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`h-10 rounded-xl flex items-center justify-center text-xl border-2 transition cursor-pointer ${
                      selectedAvatar.emoji === av.emoji
                        ? 'border-sky-500 scale-105 shadow-sm'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: av.bg }}
                  >
                    {av.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chọn độ tuổi của bé:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {AGE_GROUPS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedAge(g.id)}
                    className={`min-h-[38px] px-2.5 py-1.5 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                      selectedAge === g.id
                        ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-50'
                    }`}
                  >
                    {g.label} · {g.stageTitle}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-sm transition cursor-pointer"
            >
              Lưu hồ sơ & Bắt đầu học ngay
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
