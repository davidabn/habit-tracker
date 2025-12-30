import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  subWeeks,
  startOfMonth,
  endOfMonth,
  isSameDay,
  subDays,
  parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { HabitWithLogs, HabitLog } from '@/types';

export interface DayData {
  date: string;
  dayName: string;
  completed: number;
  total: number;
  rate: number;
}

export interface WeekData {
  weekLabel: string;
  days: DayData[];
  averageRate: number;
}

export interface StreakData {
  current: number;
  best: number;
  habitStreaks: { name: string; current: number; best: number }[];
}

export interface HabitStats {
  id: string;
  name: string;
  completedDays: number;
  totalDays: number;
  rate: number;
  target: number;
}

export interface CalendarDay {
  date: string;
  day: number;
  rate: number;
  isCurrentMonth: boolean;
}

// Calculate completion rate for a specific date
export function calculateDailyRate(
  habits: HabitWithLogs[],
  date: Date
): { completed: number; total: number; rate: number } {
  const dateStr = format(date, 'yyyy-MM-dd');
  const activeHabits = habits.filter(h => h.is_active);

  if (activeHabits.length === 0) {
    return { completed: 0, total: 0, rate: 0 };
  }

  const completed = activeHabits.filter(habit =>
    habit.logs.some(log => log.completed_at === dateStr)
  ).length;

  return {
    completed,
    total: activeHabits.length,
    rate: Math.round((completed / activeHabits.length) * 100)
  };
}

// Get weekly data for the chart (last 4 weeks)
export function getWeeklyChartData(habits: HabitWithLogs[]): WeekData[] {
  const weeks: WeekData[] = [];
  const today = new Date();

  for (let i = 3; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(today, i), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(subWeeks(today, i), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const dayData: DayData[] = days.map(day => {
      const { completed, total, rate } = calculateDailyRate(habits, day);
      return {
        date: format(day, 'yyyy-MM-dd'),
        dayName: format(day, 'EEE', { locale: ptBR }),
        completed,
        total,
        rate
      };
    });

    const validDays = dayData.filter(d => d.total > 0);
    const averageRate = validDays.length > 0
      ? Math.round(validDays.reduce((sum, d) => sum + d.rate, 0) / validDays.length)
      : 0;

    weeks.push({
      weekLabel: i === 0 ? 'Esta semana' : i === 1 ? 'Semana passada' : `${i} semanas atrás`,
      days: dayData,
      averageRate
    });
  }

  return weeks;
}

// Calculate streaks
export function calculateStreaks(habits: HabitWithLogs[]): StreakData {
  const today = new Date();
  const activeHabits = habits.filter(h => h.is_active);

  // Calculate overall streak (days with 100% completion)
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  // Check up to 365 days back
  for (let i = 0; i < 365; i++) {
    const checkDate = subDays(today, i);
    const { rate, total } = calculateDailyRate(habits, checkDate);

    if (total === 0) continue;

    if (rate === 100) {
      tempStreak++;
      if (i === currentStreak) {
        currentStreak = tempStreak;
      }
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      if (i <= currentStreak) {
        // If we haven't completed today yet, don't break the streak
        if (i === 0) continue;
      }
      tempStreak = 0;
    }
  }

  // Calculate per-habit streaks
  const habitStreaks = activeHabits.map(habit => {
    let current = 0;
    let best = 0;
    let temp = 0;

    for (let i = 0; i < 365; i++) {
      const checkDate = format(subDays(today, i), 'yyyy-MM-dd');
      const completed = habit.logs.some(log => log.completed_at === checkDate);

      if (completed) {
        temp++;
        if (i === current) {
          current = temp;
        }
        best = Math.max(best, temp);
      } else {
        if (i === 0) continue; // Don't break streak if today not completed yet
        temp = 0;
      }
    }

    return { name: habit.name, current, best };
  });

  return { current: currentStreak, best: bestStreak, habitStreaks };
}

// Get habit statistics for a period
export function getHabitStats(
  habits: HabitWithLogs[],
  periodDays: number | 'all'
): HabitStats[] {
  const today = new Date();
  const activeHabits = habits.filter(h => h.is_active);

  return activeHabits.map(habit => {
    let logs = habit.logs;

    if (periodDays !== 'all') {
      const startDate = format(subDays(today, periodDays - 1), 'yyyy-MM-dd');
      logs = habit.logs.filter(log => log.completed_at >= startDate);
    }

    const totalDays = periodDays === 'all'
      ? Math.ceil((today.getTime() - parseISO(habit.created_at).getTime()) / (1000 * 60 * 60 * 24))
      : periodDays;

    const completedDays = logs.length;
    const rate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

    return {
      id: habit.id,
      name: habit.name,
      completedDays,
      totalDays: Math.max(totalDays, 1),
      rate: Math.min(rate, 100),
      target: habit.target_per_week
    };
  }).sort((a, b) => b.rate - a.rate);
}

// Get calendar heatmap data for a month
export function getCalendarData(
  habits: HabitWithLogs[],
  month: Date
): CalendarDay[] {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);

  // Get the start of the week containing month start
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  // Get the end of the week containing month end
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return days.map(day => {
    const { rate } = calculateDailyRate(habits, day);
    const isCurrentMonth = day.getMonth() === month.getMonth();

    return {
      date: format(day, 'yyyy-MM-dd'),
      day: day.getDate(),
      rate: isCurrentMonth ? rate : -1, // -1 for days outside current month
      isCurrentMonth
    };
  });
}

// Get color intensity based on rate
export function getRateColor(rate: number): string {
  if (rate < 0) return 'transparent';
  if (rate === 0) return 'var(--system-gray5)';
  if (rate <= 25) return 'rgba(52, 199, 89, 0.25)';
  if (rate <= 50) return 'rgba(52, 199, 89, 0.5)';
  if (rate <= 75) return 'rgba(52, 199, 89, 0.75)';
  return 'var(--system-green)';
}
