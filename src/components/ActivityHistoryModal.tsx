import React, { useState, useMemo } from 'react';
import {
  Clock,
  Calendar,
  BarChart3,
  Flame,
  PieChart,
  Lightbulb,
  Sliders,
  Trash2,
  X,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  Gamepad2,
  BookOpen,
  Music,
  Palette,
  GraduationCap,
} from 'lucide-react';
import type { ParentSettings, ActivityGroupType } from '../types/learning';
import {
  getActivityStats,
  clearActivityLogs,
} from '../utils/activityTracker';

interface ActivityHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ParentSettings;
  onUpdateSettings: (next: ParentSettings) => void;
}

export const ActivityHistoryModal: React.FC<ActivityHistoryModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'all'>('today');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Group daily limits local editing state
  const [groupLimits, setGroupLimits] = useState({
    games: settings.groupDailyLimits?.games ?? 20,
    stories: settings.groupDailyLimits?.stories ?? 30,
    vocab: settings.groupDailyLimits?.vocab ?? 25,
    art: settings.groupDailyLimits?.art ?? 20,
    music: settings.groupDailyLimits?.music ?? 20,
  });

  const [dailyTotalLimit, setDailyTotalLimit] = useState(settings.dailyLimitMinutes || 20);

  const stats = useMemo(() => {
    // refreshTrigger is a dependency to force re-compute when clearing
    if (!isOpen) return null;
    return getActivityStats(timeframe);
  }, [isOpen, timeframe, refreshTrigger]);

  if (!isOpen || !stats) return null;

  const handleSaveLimits = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      dailyLimitMinutes: dailyTotalLimit,
      groupDailyLimits: groupLimits,
    });
  };

  const handleConfirmClear = () => {
    clearActivityLogs();
    setShowClearConfirm(false);
    setRefreshTrigger((v) => v + 1);
  };

  // Max value in hourly distribution for scale
  const maxHourlyMinutes = Math.max(1, ...stats.hourlyDistribution);
  // Max value in daily distribution
  const maxDailyMinutes = Math.max(1, ...stats.dailyDistribution.map((d) => d.minutes));

  const getGroupIcon = (group: ActivityGroupType) => {
    switch (group) {
      case 'vocab':
        return <GraduationCap className="w-4 h-4 text-emerald-600" />;
      case 'story':
        return <BookOpen className="w-4 h-4 text-sky-600" />;
      case 'game':
        return <Gamepad2 className="w-4 h-4 text-amber-600" />;
      case 'music':
        return <Music className="w-4 h-4 text-purple-600" />;
      case 'art':
        return <Palette className="w-4 h-4 text-pink-600" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-4xl bg-[#FFFDF7] rounded-3xl border-3 border-amber-300 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <BarChart3 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black flex items-center gap-2">
                <span>Lịch Sử Hoạt Động Của Bé</span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white/20 text-white">
                  90 ngày gần nhất
                </span>
              </h2>
              <p className="text-xs text-amber-100 font-medium">
                Dữ liệu chỉ lưu cục bộ trên máy bố mẹ, bảo mật tuyệt đối 100%
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition active:scale-95 shrink-0"
            aria-label="Đóng màn hình lịch sử"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Timeframe Segmented Switcher & Clear Button */}
        <div className="p-3 bg-white border-b border-amber-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setTimeframe('today')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                timeframe === 'today'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hôm nay
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('week')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                timeframe === 'week'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tuần này
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                timeframe === 'all'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả (90 ngày)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center gap-1.5 cursor-pointer transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa lịch sử</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Tổng thời gian</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
                {stats.totalMinutes} <span className="text-xs font-bold text-slate-400">phút</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-sky-200 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1">
                <Flame className="w-4 h-4 text-sky-500" />
                <span>Lượt hoạt động</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
                {stats.sessionCount} <span className="text-xs font-bold text-slate-400">lần</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1">
                <PieChart className="w-4 h-4 text-emerald-500" />
                <span>Nhóm yêu thích nhất</span>
              </div>
              <div className="text-sm sm:text-base font-black text-slate-800 truncate">
                {stats.topActivities[0]?.group
                  ? stats.topActivities[0].group.toUpperCase()
                  : 'Chưa có'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-purple-200 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1">
                <Sliders className="w-4 h-4 text-purple-500" />
                <span>Giới hạn ngày</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
                {dailyTotalLimit} <span className="text-xs font-bold text-slate-400">phút</span>
              </div>
            </div>
          </div>

          {/* Section: Parent Smart Insights */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Gợi Ý & Lời Khuyên Dành Cho Bố Mẹ</span>
            </div>
            <ul className="space-y-1.5">
              {stats.parentInsights.map((insight, idx) => (
                <li key={idx} className="text-xs font-medium text-slate-700 flex items-start gap-2">
                  <span className="text-amber-500 font-bold shrink-0">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Charts: Hourly Distribution (0-23h) and Daily Distribution (T2-CN) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 1. Hourly Chart */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Thời gian tương tác theo giờ trong ngày (0h – 23h)</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-bold">Đơn vị: phút</span>
              </div>
              <div className="h-28 flex items-end gap-1 pt-2 border-b border-slate-100">
                {stats.hourlyDistribution.map((mins, h) => {
                  const heightPercent = mins > 0 ? Math.max(12, Math.round((mins / maxHourlyMinutes) * 100)) : 4;
                  return (
                    <div key={h} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                      {mins > 0 && (
                        <div className="absolute -top-6 bg-slate-900 text-white text-[9px] font-bold px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                          {h}h: {mins}p
                        </div>
                      )}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-sm transition-all ${
                          mins > 0
                            ? 'bg-amber-500 group-hover:bg-amber-600'
                            : 'bg-slate-100'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1 px-0.5">
                <span>0h</span>
                <span>6h</span>
                <span>12h</span>
                <span>18h</span>
                <span>23h</span>
              </div>
            </div>

            {/* 2. Daily Chart (T2 - CN) */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phân bố theo ngày trong tuần</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-bold">Đơn vị: phút</span>
              </div>
              <div className="h-28 flex items-end gap-2 pt-2 border-b border-slate-100">
                {stats.dailyDistribution.map((d) => {
                  const heightPercent = d.minutes > 0 ? Math.max(14, Math.round((d.minutes / maxDailyMinutes) * 100)) : 4;
                  return (
                    <div key={d.label} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                      {d.minutes > 0 && (
                        <div className="absolute -top-6 bg-slate-900 text-white text-[9px] font-bold px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                          {d.minutes} phút
                        </div>
                      )}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all ${
                          d.minutes > 0
                            ? 'bg-sky-500 group-hover:bg-sky-600'
                            : 'bg-slate-100'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-slate-600 font-black mt-1 px-1">
                {stats.dailyDistribution.map((d) => (
                  <span key={d.label}>{d.label}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Group Category Breakdown & Top 5 Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Group Distribution (5 categories) */}
            <div className="lg:col-span-5 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Phân bố theo 5 nhóm nội dung
              </h3>

              {/* Stacked bar */}
              <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
                {stats.groupBreakdown.map((g) => (
                  <div
                    key={g.group}
                    style={{ width: `${g.percent}%`, backgroundColor: g.color }}
                    title={`${g.label}: ${g.minutes} phút (${g.percent}%)`}
                    className="h-full transition-all"
                  />
                ))}
              </div>

              {/* Group items */}
              <div className="space-y-2 pt-1">
                {stats.groupBreakdown.map((g) => (
                  <div key={g.group} className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                      <span className="text-slate-700">{g.label}</span>
                    </div>
                    <div className="text-slate-900 tabular-nums">
                      {g.minutes}p <span className="text-slate-400 font-normal">({g.percent}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 5 Activities */}
            <div className="lg:col-span-7 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Top 5 hoạt động bé yêu thích nhất
              </h3>

              {stats.topActivities.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 font-medium">
                  Chưa có dữ liệu hoạt động trong giai đoạn này.
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.topActivities.map((act, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-xs font-black flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        {getGroupIcon(act.group)}
                        <span className="text-xs font-extrabold text-slate-900 truncate">
                          {act.title}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-500 shrink-0 tabular-nums">
                        {act.count} lượt · <strong className="text-amber-600">{act.minutes}p</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section: Timeline of Recent Activities */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>Dòng thời gian hoạt động gần đây</span>
              <span className="text-[10px] text-slate-400 font-normal">20 sự kiện mới nhất</span>
            </h3>

            {stats.recentTimeline.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                Chưa có hoạt động nào được ghi nhận.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                {stats.recentTimeline.map((item) => {
                  const dateStr = new Date(item.timestamp).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <div key={item.id} className="py-2 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{dateStr}</span>
                        {getGroupIcon(item.group)}
                        <span className="font-extrabold text-slate-800 truncate">{item.title}</span>
                        {item.detail && (
                          <span className="text-[10px] text-slate-500 truncate hidden sm:inline">
                            ({item.detail})
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 shrink-0 tabular-nums">
                        {Math.max(1, Math.round(item.durationSeconds / 60))} phút
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Screen Time Limits & Group Caps */}
          <section className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black">Cài Đặt Giới Hạn Giờ Chơi & Giờ Nghỉ Cho Bé</h3>
              </div>
              <span className="text-[10px] text-amber-300 font-bold bg-amber-400/20 px-2 py-0.5 rounded-md">
                Tự động nhắc nhở dịu dàng
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Khi thời gian chơi chỉ còn 2 phút, cô giáo sẽ dùng giọng nói êm dịu thông báo nhẹ nhàng cho bé chuẩn bị nghỉ ngơi. Khi hết giờ, ứng dụng hiển thị màn hình nghỉ mắt và chỉ bố mẹ mới mở khóa được.
            </p>

            <form onSubmit={handleSaveLimits} className="space-y-4">
              {/* Daily total limit */}
              <div className="bg-white/10 p-3 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black text-white">Tổng thời gian tối đa mỗi ngày</div>
                  <div className="text-[10px] text-slate-300">Đồng bộ trực tiếp với bộ đếm giờ trên thanh đầu</div>
                </div>
                <div className="flex items-center gap-2">
                  {[10, 15, 20, 30, 45].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDailyTotalLimit(m)}
                      className={`min-h-[36px] px-2.5 rounded-lg text-xs font-black cursor-pointer transition tabular-nums ${
                        dailyTotalLimit === m
                          ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                          : 'bg-white/10 text-slate-200 hover:bg-white/20'
                      }`}
                    >
                      {m}p
                    </button>
                  ))}
                </div>
              </div>

              {/* Group limits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="bg-white/5 p-2.5 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Gamepad2 className="w-3.5 h-3.5 text-amber-400" /> Trò chơi trí tuệ tối đa:
                  </span>
                  <select
                    value={groupLimits.games}
                    onChange={(e) => setGroupLimits((p) => ({ ...p, games: Number(e.target.value) }))}
                    className="bg-slate-800 text-white text-xs font-bold rounded-lg px-2 py-1 border border-slate-700"
                  >
                    {[10, 15, 20, 30, 45].map((m) => (
                      <option key={m} value={m}>{m} phút</option>
                    ))}
                  </select>
                </div>

                <div className="bg-white/5 p-2.5 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-400" /> Nghe truyện tranh tối đa:
                  </span>
                  <select
                    value={groupLimits.stories}
                    onChange={(e) => setGroupLimits((p) => ({ ...p, stories: Number(e.target.value) }))}
                    className="bg-slate-800 text-white text-xs font-bold rounded-lg px-2 py-1 border border-slate-700"
                  >
                    {[15, 20, 30, 45, 60].map((m) => (
                      <option key={m} value={m}>{m} phút</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="min-h-[42px] px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer transition shadow-sm active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lưu Cài Đặt Giới Hạn</span>
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Clear History Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl p-5 border-2 border-rose-300 shadow-2xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="text-base font-black text-center text-slate-900">
                Xác nhận xóa lịch sử?
              </h4>
              <p className="text-xs text-center text-slate-600">
                Toàn bộ nhật ký hoạt động của bé trên thiết bị này sẽ được xóa sạch. Hành động này không thể hoàn tác.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="min-h-[40px] rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClear}
                  className="min-h-[40px] rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 cursor-pointer shadow-xs"
                >
                  Xác nhận xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
