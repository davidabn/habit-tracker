'use client';

import type { HabitStats } from '@/lib/progress-utils';

interface HabitBarsProps {
  habits: HabitStats[];
}

export function HabitBars({ habits }: HabitBarsProps) {
  if (habits.length === 0) {
    return (
      <div className="bg-bg-secondary rounded-xl p-4">
        <h3 className="text-headline text-label-primary mb-4">Por Habito</h3>
        <p className="text-body text-label-secondary text-center py-8">
          Nenhum habito encontrado
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-secondary rounded-xl p-4">
      <h3 className="text-headline text-label-primary mb-4">Por Habito</h3>
      <div className="space-y-4">
        {habits.map((habit) => (
          <div key={habit.id}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-body text-label-primary truncate pr-4">
                {habit.name}
              </span>
              <span className="text-footnote text-label-secondary shrink-0">
                {habit.completedDays}/{habit.totalDays} dias ({habit.rate}%)
              </span>
            </div>
            <div className="h-2 bg-gray-5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-apple"
                style={{
                  width: `${habit.rate}%`,
                  backgroundColor: habit.rate >= 80
                    ? 'var(--system-green)'
                    : habit.rate >= 50
                    ? 'var(--system-yellow)'
                    : 'var(--system-orange)'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
