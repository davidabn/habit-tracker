'use client';

import { HabitCard } from './habit-card';
import type { HabitWithLogs } from '@/types';

interface HabitListProps {
  habits: HabitWithLogs[];
  onHabitToggle?: (habitId: string, completed: boolean) => void;
}

export function HabitList({ habits, onHabitToggle }: HabitListProps) {
  const pendingHabits = habits.filter((h) => !h.is_completed_today);
  const completedHabits = habits.filter((h) => h.is_completed_today);

  return (
    <div className="space-y-6">
      {pendingHabits.length > 0 && (
        <div>
          <p className="text-footnote text-label-secondary uppercase tracking-wide px-4 mb-2">
            Pendentes
          </p>
          <div className="bg-bg-primary rounded-card overflow-hidden divide-y divide-separator">
            {pendingHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} onToggle={(completed) => onHabitToggle?.(habit.id, completed)} />
            ))}
          </div>
        </div>
      )}

      {completedHabits.length > 0 && (
        <div>
          <p className="text-footnote text-label-secondary uppercase tracking-wide px-4 mb-2">
            Concluídos
          </p>
          <div className="bg-bg-primary rounded-card overflow-hidden divide-y divide-separator">
            {completedHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} onToggle={(completed) => onHabitToggle?.(habit.id, completed)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
