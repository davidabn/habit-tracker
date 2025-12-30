'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTheme } from '@/components/theme-provider';
import type { WeekData } from '@/lib/progress-utils';

interface WeeklyChartProps {
  data: WeekData[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Transform data for the chart
  const chartData = data[0]?.days.map((_, dayIndex) => {
    const dayData: Record<string, string | number> = {
      day: data[0].days[dayIndex].dayName.charAt(0).toUpperCase() +
           data[0].days[dayIndex].dayName.slice(1, 3)
    };

    data.forEach((week, weekIndex) => {
      dayData[`week${weekIndex}`] = week.days[dayIndex].rate;
    });

    return dayData;
  }) || [];

  const colors = [
    'var(--system-blue)',
    'var(--system-green)',
    'var(--system-purple)',
    'var(--system-orange)'
  ];

  return (
    <div className="bg-bg-secondary rounded-xl p-4">
      <h3 className="text-headline text-label-primary mb-4">Evolucao Semanal</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
            />
            <XAxis
              dataKey="day"
              tick={{ fill: 'var(--label-secondary)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--separator)' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: 'var(--label-secondary)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--separator)' }}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--separator)',
                borderRadius: '8px',
                fontSize: '13px'
              }}
              labelStyle={{ color: 'var(--label-primary)' }}
              formatter={(value: number) => [`${value}%`, '']}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value: string) => {
                const weekIndex = parseInt(value.replace('week', ''));
                return data[weekIndex]?.weekLabel || value;
              }}
            />
            {data.map((week, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={`week${index}`}
                stroke={colors[index]}
                strokeWidth={index === data.length - 1 ? 2.5 : 1.5}
                dot={index === data.length - 1}
                opacity={index === data.length - 1 ? 1 : 0.5}
                name={`week${index}`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
