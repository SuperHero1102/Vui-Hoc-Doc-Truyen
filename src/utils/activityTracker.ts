import type { ActivityGroupType, ActivityLogEntry } from '../types/learning';

const STORAGE_KEY = 'bevuihoc_activity_log_v2';
const MAX_RETENTION_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

export function getActivityLogs(): ActivityLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as ActivityLogEntry[];
    const cutoff = Date.now() - MAX_RETENTION_MS;
    // Auto purge entries older than 90 days
    return list.filter((item) => item.timestamp >= cutoff);
  } catch {
    return [];
  }
}

export function saveActivityLogs(logs: ActivityLogEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    const cutoff = Date.now() - MAX_RETENTION_MS;
    const pruned = logs.filter((item) => item.timestamp >= cutoff).slice(-1500); // Cap at 1500 items max
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
  } catch {
    // ignore quota errors
  }
}

export function logActivity(
  group: ActivityGroupType,
  title: string,
  detail?: string,
  durationSeconds = 60
): void {
  const currentLogs = getActivityLogs();
  const newEntry: ActivityLogEntry = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    group,
    title,
    detail,
    timestamp: Date.now(),
    durationSeconds: Math.max(10, Math.round(durationSeconds)),
  };

  currentLogs.unshift(newEntry);
  saveActivityLogs(currentLogs);
}

export function clearActivityLogs(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Starts a live activity timer and returns a stop function that logs the spent duration
 */
export function startTrackingActivity(
  group: ActivityGroupType,
  title: string,
  detail?: string
): () => void {
  const startTime = Date.now();
  let stopped = false;

  return () => {
    if (stopped) return;
    stopped = true;
    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
    if (elapsedSeconds >= 8) {
      logActivity(group, title, detail, elapsedSeconds);
    }
  };
}

export interface ActivityFilterStats {
  totalMinutes: number;
  sessionCount: number;
  hourlyDistribution: number[]; // 24 hours
  dailyDistribution: { dayIndex: number; label: string; minutes: number }[]; // 7 days (Mon-Sun)
  topActivities: { title: string; count: number; minutes: number; group: ActivityGroupType }[];
  groupBreakdown: {
    group: ActivityGroupType;
    label: string;
    minutes: number;
    percent: number;
    color: string;
  }[];
  recentTimeline: ActivityLogEntry[];
  parentInsights: string[];
}

const GROUP_LABELS: Record<ActivityGroupType, { label: string; color: string }> = {
  vocab: { label: 'Từ vựng & Bài học', color: '#10B981' }, // Emerald
  story: { label: 'Đọc truyện tranh', color: '#0EA5E9' }, // Sky
  game: { label: 'Trò chơi trí tuệ', color: '#F59E0B' }, // Amber
  music: { label: 'Âm nhạc & Đàn', color: '#8B5CF6' }, // Purple
  art: { label: 'Tô màu & Sáng tạo', color: '#EC4899' }, // Pink
};

export function getActivityStats(timeframe: 'today' | 'week' | 'all'): ActivityFilterStats {
  const allLogs = getActivityLogs();
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = startOfToday - ((now.getDay() + 6) % 7) * 24 * 60 * 60 * 1000;

  const filtered = allLogs.filter((item) => {
    if (timeframe === 'today') return item.timestamp >= startOfToday;
    if (timeframe === 'week') return item.timestamp >= startOfWeek;
    return true; // 'all' (up to 90 days)
  });

  // Total minutes & sessions
  const totalSeconds = filtered.reduce((acc, curr) => acc + (curr.durationSeconds || 60), 0);
  const totalMinutes = Math.round(totalSeconds / 60);
  const sessionCount = filtered.length;

  // Hourly distribution (0-23h)
  const hourlyDistribution = new Array(24).fill(0);
  for (const item of filtered) {
    const h = new Date(item.timestamp).getHours();
    hourlyDistribution[h] += Math.round((item.durationSeconds || 60) / 60);
  }

  // Daily distribution (Mon to Sun)
  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const dailyDistribution = daysOfWeek.map((label, idx) => ({
    dayIndex: idx,
    label,
    minutes: 0,
  }));

  for (const item of filtered) {
    const d = new Date(item.timestamp);
    // getDay(): 0 is Sunday, 1 is Monday ...
    const dayIdx = (d.getDay() + 6) % 7;
    dailyDistribution[dayIdx].minutes += Math.round((item.durationSeconds || 60) / 60);
  }

  // Top 5 activities
  const activityMap = new Map<
    string,
    { title: string; count: number; seconds: number; group: ActivityGroupType }
  >();

  for (const item of filtered) {
    const existing = activityMap.get(item.title);
    if (existing) {
      existing.count += 1;
      existing.seconds += item.durationSeconds || 60;
    } else {
      activityMap.set(item.title, {
        title: item.title,
        count: 1,
        seconds: item.durationSeconds || 60,
        group: item.group,
      });
    }
  }

  const topActivities = Array.from(activityMap.values())
    .map((a) => ({
      title: a.title,
      count: a.count,
      minutes: Math.max(1, Math.round(a.seconds / 60)),
      group: a.group,
    }))
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 5);

  // Group breakdown
  const groupMinutesMap: Record<ActivityGroupType, number> = {
    vocab: 0,
    story: 0,
    game: 0,
    music: 0,
    art: 0,
  };

  for (const item of filtered) {
    if (groupMinutesMap[item.group] !== undefined) {
      groupMinutesMap[item.group] += Math.round((item.durationSeconds || 60) / 60);
    }
  }

  const groupTotal = Object.values(groupMinutesMap).reduce((a, b) => a + b, 0) || 1;

  const groupBreakdown = (Object.keys(GROUP_LABELS) as ActivityGroupType[]).map((grp) => {
    const mins = groupMinutesMap[grp];
    return {
      group: grp,
      label: GROUP_LABELS[grp].label,
      minutes: mins,
      percent: Math.round((mins / groupTotal) * 100),
      color: GROUP_LABELS[grp].color,
    };
  });

  // Recent timeline (latest 20)
  const recentTimeline = filtered.slice(0, 20);

  // Smart Parent Insights
  const parentInsights: string[] = [];

  if (sessionCount === 0) {
    parentInsights.push('Bé chưa có hoạt động nào trong khung thời gian này. Bố mẹ hãy cùng bé khám phá các câu chuyện hoặc trò chơi nhé!');
  } else {
    // Check group dominance
    const highestGroup = [...groupBreakdown].sort((a, b) => b.minutes - a.minutes)[0];
    if (highestGroup && highestGroup.percent >= 45) {
      if (highestGroup.group === 'game') {
        parentInsights.push(
          `Bé dành khá nhiều thời gian (${highestGroup.percent}%) cho Trò chơi trí tuệ. Bố mẹ nên gợi ý bé xen kẽ thêm Truyện tranh hoặc Bài học từ vựng để cân bằng khả năng ngôn ngữ.`
        );
      } else if (highestGroup.group === 'story') {
        parentInsights.push(
          `Bé rất say mê đọc truyện (${highestGroup.percent}% thời lượng)! Đây là thói quen tuyệt vời giúp phát triển vốn từ ngữ và trí tưởng tượng phong phú.`
        );
      } else if (highestGroup.group === 'art') {
        parentInsights.push(
          `Bé thể hiện năng khiếu và sở thích vượt trội về Mỹ thuật & Tô màu sáng tạo (${highestGroup.percent}%). Bố mẹ hãy động viên bé tiếp tục phát huy nhé!`
        );
      } else if (highestGroup.group === 'vocab') {
        parentInsights.push(
          `Bé chăm chỉ học từ vựng (${highestGroup.percent}%). Bé đang trong giai đoạn tiếp thu ngôn ngữ song ngữ Việt - Anh rất nhanh.`
        );
      } else if (highestGroup.group === 'music') {
        parentInsights.push(
          `Bé rất yêu thích Âm nhạc và gõ đàn (${highestGroup.percent}%). Cảm thụ tiết tấu âm thanh từ nhỏ giúp kích hoạt hai bán cầu não của bé.`
        );
      }
    }

    // Screen time advice
    if (timeframe === 'today') {
      if (totalMinutes > 30) {
        parentInsights.push(
          `Hôm nay bé đã tương tác ${totalMinutes} phút. Theo khuyến nghị y khoa, trẻ nhỏ nên có thời gian nghỉ mắt sau mỗi 15-20 phút tương tác màn hình.`
        );
      } else {
        parentInsights.push(
          `Thời gian tương tác hôm nay (${totalMinutes} phút) rất hợp lý và an toàn cho thị giác của bé.`
        );
      }
    }

    if (topActivities.length > 0) {
      parentInsights.push(
        `Hoạt động yêu thích nhất của bé hiện tại là "${topActivities[0].title}". Bố mẹ có thể trò chuyện với bé về chủ đề này trong sinh hoạt hàng ngày.`
      );
    }
  }

  return {
    totalMinutes,
    sessionCount,
    hourlyDistribution,
    dailyDistribution,
    topActivities,
    groupBreakdown,
    recentTimeline,
    parentInsights,
  };
}
