'use client';

import { useState, useMemo, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getCalendarData, getRateColor, type CalendarDay } from '@/lib/progress-utils';
import type { HabitWithLogs } from '@/types';

interface CalendarHeatmapProps {
  habits: HabitWithLogs[];
}

export const CalendarHeatmap = memo(function CalendarHeatmap({ habits }: CalendarHeatmapProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarData = useMemo(() => getCalendarData(habits, currentMonth), [habits, currentMonth]);

  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const goToPreviousMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));

  // Group days into weeks
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < calendarData.length; i += 7) {
    weeks.push(calendarData.slice(i, i + 7));
  }

  return (
    <div className="bg-bg-secondary rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-headline text-label-primary">Calendario</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-bg-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-label-secondary" />
          </button>
          <span className="text-body text-label-primary min-w-[120px] text-center capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <button
            onClick={goToNextMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-bg-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-label-secondary" />
          </button>
        </div>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="text-caption1 text-label-tertiary text-center py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`
                  aspect-square rounded-sm flex items-center justify-center
                  text-caption1 transition-colors
                  ${day.isCurrentMonth ? 'text-label-primary' : 'text-label-quaternary'}
                `}
                style={{
                  backgroundColor: day.isCurrentMonth ? getRateColor(day.rate) : 'transparent'
                }}
                title={day.isCurrentMonth ? `${day.rate}% completo` : ''}
              >
                {day.day}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-4">
        <span className="text-caption2 text-label-tertiary mr-2">Menos</span>
        <div
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: 'var(--system-gray5)' }}
        />
        <div
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: 'rgba(52, 199, 89, 0.25)' }}
        />
        <div
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: 'rgba(52, 199, 89, 0.5)' }}
        />
        <div
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: 'rgba(52, 199, 89, 0.75)' }}
        />
        <div
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: 'var(--system-green)' }}
        />
        <span className="text-caption2 text-label-tertiary ml-2">Mais</span>
      </div>
    </div>
  );
});
