'use client';

import { useState, useCallback } from 'react';
import { useCompletionFeedback } from '@/hooks/use-completion-feedback';
import { Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { HabitWithLogs } from '@/types';
import { format } from 'date-fns';

interface HabitCardProps {
  habit: HabitWithLogs;
  onToggle?: (completed: boolean) => void;
}

export function HabitCard({ habit, onToggle }: HabitCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(habit.is_completed_today);
  const [showRipple, setShowRipple] = useState(false);
  const { triggerFeedback } = useCompletionFeedback();

  const triggerRipple = useCallback((isCompleting: boolean) => {
    if (isCompleting) {
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 400);
    }
    triggerFeedback(isCompleting);
  }, [triggerFeedback]);

  const handleToggle = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const supabase = createClient();
      const today = format(new Date(), 'yyyy-MM-dd');

      if (isCompleted) {
        const todayLog = habit.logs.find((log) => log.completed_at === today);
        if (todayLog) {
          await supabase.from('habit_logs').delete().eq('id', todayLog.id);
        }
        setIsCompleted(false);
        triggerRipple(false);
        onToggle?.(false);
      } else {
        await supabase.from('habit_logs').insert({
          habit_id: habit.id,
          completed_at: today,
          source: 'web',
        });
        setIsCompleted(true);
        triggerRipple(true);
        onToggle?.(true);
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`
        flex items-center gap-4 px-4 py-3 bg-bg-primary
        transition-all duration-fast ease-apple
        ${isCompleted ? 'bg-apple-green/5' : ''}
      `}
    >
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`
          relative flex-shrink-0 w-6 h-6 rounded-full
          flex items-center justify-center
          transition-all duration-fast ease-apple
          ${isLoading ? 'opacity-50' : ''}
          ${isCompleted
            ? 'bg-apple-green text-white'
            : 'border-2 border-gray-3 hover:border-apple-green'
          }
        `}
      >
        {showRipple && (
          <span className="absolute inset-0 rounded-full bg-apple-green animate-ripple" />
        )}
        {isCompleted && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`
            text-body truncate transition-colors duration-fast
            ${isCompleted ? 'text-label-tertiary line-through' : 'text-label-primary'}
          `}
        >
          {habit.name}
        </p>
        {habit.description && (
          <p className="text-subhead text-label-tertiary truncate">
            {habit.description}
          </p>
        )}
      </div>

      {habit.reminder_time && (
        <span className="text-caption1 text-label-quaternary shrink-0">
          {habit.reminder_time.slice(0, 5)}
        </span>
      )}
    </div>
  );
}
