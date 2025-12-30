'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { HabitCard } from './habit-card';
import type { HabitWithLogs } from '@/types';
import { format } from 'date-fns';

interface HabitListProps {
  habits: HabitWithLogs[];
}

export function HabitList({ habits: initialHabits }: HabitListProps) {
  const [habits, setHabits] = useState(initialHabits);

  useEffect(() => {
    setHabits(initialHabits);
  }, [initialHabits]);

  // Handle local state update when habit is toggled
  const handleToggle = useCallback((habitId: string, completed: boolean) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;

      if (completed) {
        // Add log
        return {
          ...habit,
          is_completed_today: true,
          logs: [...habit.logs, {
            id: `temp-${Date.now()}`,
            habit_id: habitId,
            completed_at: today,
            source: 'web' as const,
            created_at: new Date().toISOString()
          }]
        };
      } else {
        // Remove log
        return {
          ...habit,
          is_completed_today: false,
          logs: habit.logs.filter(log => log.completed_at !== today)
        };
      }
    }));
  }, []);

  // Real-time subscription for multi-device sync (without refresh)
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
        (payload) => {
          // Only refresh if change came from another source (e.g., WhatsApp)
          const newRecord = payload.new as { source?: string } | undefined;
          if (newRecord?.source === 'whatsapp') {
            // For WhatsApp changes, do a soft refresh of data
            window.location.reload();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
              <HabitCard key={habit.id} habit={habit} onToggle={(completed) => handleToggle(habit.id, completed)} />
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
              <HabitCard key={habit.id} habit={habit} onToggle={(completed) => handleToggle(habit.id, completed)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
