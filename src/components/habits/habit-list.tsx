'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { HabitCard } from './habit-card';
import type { HabitWithLogs } from '@/types';

interface HabitListProps {
  habits: HabitWithLogs[];
}

export function HabitList({ habits: initialHabits }: HabitListProps) {
  const router = useRouter();
  const [habits, setHabits] = useState(initialHabits);

  useEffect(() => {
    setHabits(initialHabits);
  }, [initialHabits]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('habit-logs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'habit_logs',
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

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
              <HabitCard key={habit.id} habit={habit} />
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
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
