'use client';

import { useState } from 'react';
import { StreakCard } from './streak-card';
import { WeeklyChart } from './weekly-chart';
import { CalendarHeatmap } from './calendar-heatmap';
import { HabitBars } from './habit-bars';
import {
  calculateStreaks,
  getWeeklyChartData,
  getHabitStats
} from '@/lib/progress-utils';
import type { HabitWithLogs } from '@/types';

interface ProgressDashboardProps {
  habits: HabitWithLogs[];
}

type Period = 7 | 30 | 'all';

export function ProgressDashboard({ habits }: ProgressDashboardProps) {
  const [period, setPeriod] = useState<Period>(7);

  const streakData = calculateStreaks(habits);
  const weeklyData = getWeeklyChartData(habits);
  const habitStats = getHabitStats(habits, period);

  const periodLabels: Record<Period, string> = {
    7: '7 dias',
    30: '30 dias',
    all: 'Todos'
  };

  return (
    <div className="space-y-6">
      {/* Header with period selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-large-title text-label-primary">Progresso</h1>
        <div className="flex bg-bg-secondary rounded-lg p-1">
          {([7, 30, 'all'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`
                px-3 py-1.5 rounded-md text-footnote font-medium
                transition-colors duration-fast ease-apple
                ${period === p
                  ? 'bg-bg-primary text-label-primary shadow-apple'
                  : 'text-label-secondary hover:text-label-primary'
                }
              `}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Streak Cards */}
      <StreakCard data={streakData} />

      {/* Weekly Chart */}
      <WeeklyChart data={weeklyData} />

      {/* Calendar Heatmap */}
      <CalendarHeatmap habits={habits} />

      {/* Habit Bars */}
      <HabitBars habits={habitStats} />
    </div>
  );
}
