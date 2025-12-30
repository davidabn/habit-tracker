'use client';

import { memo } from 'react';
import { Flame, Trophy } from 'lucide-react';
import type { StreakData } from '@/lib/progress-utils';

interface StreakCardProps {
  data: StreakData;
}

export const StreakCard = memo(function StreakCard({ data }: StreakCardProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Current Streak */}
      <div className="bg-bg-secondary rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-apple-orange/10 flex items-center justify-center">
            <Flame className="w-4 h-4 text-apple-orange" />
          </div>
          <span className="text-footnote text-label-secondary">Sequência</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-title1 text-label-primary">{data.current}</span>
          <span className="text-footnote text-label-secondary">
            {data.current === 1 ? 'dia' : 'dias'}
          </span>
        </div>
      </div>

      {/* Best Streak */}
      <div className="bg-bg-secondary rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-apple-yellow/10 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-apple-yellow" />
          </div>
          <span className="text-footnote text-label-secondary">Recorde</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-title1 text-label-primary">{data.best}</span>
          <span className="text-footnote text-label-secondary">
            {data.best === 1 ? 'dia' : 'dias'}
          </span>
        </div>
      </div>
    </div>
  );
});
