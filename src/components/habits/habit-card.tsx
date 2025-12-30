'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { HabitWithLogs } from '@/types';
import { format } from 'date-fns';

interface HabitCardProps {
  habit: HabitWithLogs;
  onToggle?: () => void;
}

export function HabitCard({ habit, onToggle }: HabitCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(habit.is_completed_today);

  const handleToggle = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const supabase = createClient();
      const today = format(new Date(), 'yyyy-MM-dd');

      if (isCompleted) {
        // Desmarcar - remover log de hoje
        const todayLog = habit.logs.find((log) => log.completed_at === today);
        if (todayLog) {
          await supabase.from('habit_logs').delete().eq('id', todayLog.id);
        }
        setIsCompleted(false);
      } else {
        // Marcar como feito - criar log
        await supabase.from('habit_logs').insert({
          habit_id: habit.id,
          completed_at: today,
          source: 'web',
        });
        setIsCompleted(true);
      }

      onToggle?.();
    } catch (error) {
      console.error('Error toggling habit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`
        flex items-center gap-4 p-4 bg-white rounded-xl border
        transition-all duration-200
        ${isCompleted
          ? 'border-primary-200 bg-primary-50/50'
          : 'border-gray-200 hover:border-gray-300'
        }
      `}
    >
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`
          flex-shrink-0 w-7 h-7 rounded-full border-2
          flex items-center justify-center
          transition-all duration-200
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isCompleted
            ? 'bg-primary-600 border-primary-600 text-white'
            : 'border-gray-300 hover:border-primary-400'
          }
        `}
      >
        {isCompleted && <Check className="w-4 h-4" />}
      </button>

      <div className="flex-1 min-w-0">
        <h3
          className={`
            font-medium truncate
            ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}
          `}
        >
          {habit.name}
        </h3>
        {habit.description && (
          <p className="text-sm text-gray-500 truncate mt-0.5">
            {habit.description}
          </p>
        )}
      </div>

      {habit.reminder_time && (
        <span className="text-xs text-gray-400 shrink-0">
          {habit.reminder_time.slice(0, 5)}
        </span>
      )}
    </div>
  );
}
