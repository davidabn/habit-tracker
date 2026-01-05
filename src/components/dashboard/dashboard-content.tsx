'use client';

import { useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { HabitList } from '@/components/habits/habit-list';
import { ProgressRing } from '@/components/dashboard/progress-ring';
import { PlantGrowth } from '@/components/dashboard/plant-growth';
import { SceneBackground } from '@/components/dashboard/scene-background';
import { Card, CardContent } from '@/components/ui/card';
import type { HabitWithLogs } from '@/types';

interface DashboardContentProps {
  initialHabits: HabitWithLogs[];
}

export function DashboardContent({ initialHabits }: DashboardContentProps) {
  const [habits, setHabits] = useState(initialHabits);

  // Sync with server data when it changes
  useEffect(() => {
    setHabits(initialHabits);
  }, [initialHabits]);

  // Calculate progress dynamically
  const completed = habits.filter((h) => h.is_completed_today).length;
  const total = habits.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Handle habit toggle - updates local state immediately
  const handleHabitToggle = useCallback((habitId: string, isCompleted: boolean) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;

      if (isCompleted) {
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
        return {
          ...habit,
          is_completed_today: false,
          logs: habit.logs.filter(log => log.completed_at !== today)
        };
      }
    }));
  }, []);

  // Real-time subscription for external changes (WhatsApp)
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('dashboard-habit-logs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'habit_logs',
        },
        (payload) => {
          const newRecord = payload.new as { source?: string } | undefined;
          if (newRecord?.source === 'whatsapp') {
            window.location.reload();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (habits.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-body text-label-secondary mb-4">
            Voce ainda nao tem habitos cadastrados.
          </p>
          <a
            href="/dashboard/habits"
            className="text-apple-blue font-semibold hover:opacity-80"
          >
            Criar primeiro habito
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Progress Card with Scene */}
      <SceneBackground>
        <div className="relative px-4 pt-4 pb-4">
          {/* Top row: Progress info */}
          <div className="flex items-center gap-3 mb-4">
            <ProgressRing percentage={percentage} size={48} lightText />
            <div>
              <p className="text-title3 text-white drop-shadow-md">
                {completed}/{total}
              </p>
              <p className="text-footnote text-white/80 drop-shadow-sm">
                {completed === total && total > 0
                  ? 'Todos concluidos!'
                  : `${total - completed} restante${total - completed !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          {/* Plant - large and centered */}
          <div className="flex justify-center -mb-2">
            <PlantGrowth percentage={percentage} size={140} />
          </div>
        </div>
      </SceneBackground>

      {/* Habit List */}
      <HabitList habits={habits} onHabitToggle={handleHabitToggle} />
    </>
  );
}
