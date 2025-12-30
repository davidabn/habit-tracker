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

    // Subscribe to habit_logs changes for realtime updates
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
          // Refresh the page data when logs change
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
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Pendentes
          </h2>
          <div className="space-y-2">
            {pendingHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
              />
            ))}
          </div>
        </div>
      )}

      {completedHabits.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Concluídos
          </h2>
          <div className="space-y-2">
            {completedHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
